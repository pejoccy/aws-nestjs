import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { Repository } from 'typeorm';
import { Account } from '../../account/account.entity';
import { Specialist } from '../../account/specialist/specialist.entity';
import { AppUtilities } from '../../app.utilities';
import { AuthService } from '../../auth/auth.service';
import { BaseService } from '../../common/base/service';
import { CacheService } from '../../common/cache/cache.service';
import { PaginationCursorOptionsDto } from '../../common/dto';
import {
  AuthTokenTypes,
  CommsProviders,
  InviteStatus,
} from '../../common/interfaces';
import { MailerService } from '../../common/mailer/mailer.service';
import { ChatService } from '../../comms/chat/chat.service';
import { MeetService } from '../../comms/meet/meet.service';
import { ChimeCommsProvider } from '../../comms/providers/chime';
import { InviteCollaboratorDto } from './dto/invite-collaborator.dto';
import { SearchSessionDto } from './dto/search-session.dto';
import { SessionToCollaborator } from './session-collaborator/session-collaborator.entity';
import { SessionInvite } from './session-invite/session-invite.entity';
import { CreateSessionNoteDto } from './session-note/dto/create-session-note.dto';
import { SessionNote } from './session-note/session-note.entity';
import { SessionReport } from './session-report/session-report.entity';
import { Session } from './session.entity';

@Injectable()
export class SessionService extends BaseService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(SessionToCollaborator)
    private sessionCollaboratorRepository: Repository<SessionToCollaborator>,
    @InjectRepository(SessionNote)
    private sessionNoteRepository: Repository<SessionNote>,
    @InjectRepository(SessionReport)
    private sessionReportRepository: Repository<SessionReport>,
    @InjectRepository(Specialist)
    private specialistRepository: Repository<Specialist>,
    @InjectRepository(SessionInvite)
    private sessionInviteRepository: Repository<SessionInvite>,
    private appUtilities: AppUtilities,
    private mailService: MailerService,
    private cacheService: CacheService,
    private configService: ConfigService,
    private authService: AuthService,
    private chatService: ChatService,
    private meetService: MeetService,
    private commsProvider: ChimeCommsProvider,
  ) {
    super();
  }

  async getSessions(
    { limit, page, searchText }: SearchSessionDto,
    account: Account,
  ) {
    const qb = this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.collaborators', 'collaborators')
      .leftJoinAndSelect('session.files', 'files')
      .leftJoinAndSelect('session.notes', 'notes')
      .leftJoinAndSelect('session.createdBy', 'createdBy')
      .leftJoinAndSelect('session.reportTemplate', 'reportTemplate')
      .where(
        `(session."patientId" = :accountId OR session."creatorId" = :accountId OR collaborators_session."accountId" = :accountId) AND ${
          (searchText && ' session.name ILIKE :name ') || ':name = :name'
        }`,
      )
      .setParameters({
        accountId: account.id,
        name: `%${searchText}%`,
      });

    return this.paginate(qb, { limit, page });
  }

  async getSession(id: number, account: Account) {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: [
        'patient',
        'collaborators',
        'collaborators.specialist',
        'files',
        'files.createdBy',
        'createdBy',
        'createdBy.patient',
        'createdBy.specialist',
        'notes',
        'notes.createdBy',
        'notes.createdBy.patient',
        'notes.createdBy.specialist',
        'reportTemplate',
      ],
    });
    if (
      !session ||
      !this.isCollaborator(session, session.collaborators, account)
    ) {
      throw new NotFoundException('Session not found!');
    }

    return session;
  }

  async inviteCollaborator(
    sessionId: number,
    item: InviteCollaboratorDto,
    account: Account,
  ) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['collaborators', 'patient'],
    });
    if (
      !session ||
      !this.isCollaborator(session, session.collaborators, account)
    ) {
      throw new NotAcceptableException('Unauthorized/Invalid session!');
    }
    const invitation = await this.sessionInviteRepository.findOne({
      where: { sessionId, inviteeEmail: item.email },
    });
    if (
      !!invitation &&
      [InviteStatus.ACCEPTED, InviteStatus.DECLINED].includes(invitation.status)
    ) {
      throw new NotAcceptableException(
        `Invitee has ${invitation.status} invitation`,
      );
    }
    const invitationWindowMins = 2 * 60 * 60;
    const expiresAt = moment().add(invitationWindowMins, 'm').toDate();
    const inviteHash = this.appUtilities.generateShortCode();

    await this.sessionInviteRepository.manager
      .createQueryBuilder()
      .insert()
      .into(SessionInvite)
      .values({
        permission: item.permission,
        token: inviteHash,
        inviteeEmail: item.email,
        sessionId,
        expiresAt,
        status: InviteStatus.PENDING,
      })
      .orUpdate(['token', 'status', 'expiresAt'], ['sessionId', 'inviteeEmail'])
      .execute();
    await this.cacheService.set(
      inviteHash,
      { ...item, invitedBy: account.id, sessionId },
      invitationWindowMins,
    );

    // send email
    this.mailService.sendInviteCollaboratorEmail(
      item.email,
      inviteHash,
      sessionId,
    );
  }

  async shareSession(sessionId: number, account: Account) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['collaborators', 'patient'],
    });
    if (!this.isSessionOwner(session, account)) {
      throw new NotAcceptableException('Unauthorized to share session!');
    }
    // generate jwt token -> save it in a cache
    const anonymousUser = await this.accountRepository.findOne({
      where: { isAnonymous: true },
    });
    if (!anonymousUser) {
      throw new ServiceUnavailableException(
        'Session sharing account not properly set up!',
      );
    }
    const [sessionCacheKey] = await this.getSessionSharingCacheKey(sessionId);
    const cacheData = await this.cacheService.get(sessionCacheKey);
    if (!cacheData) {
      const ttl = 60 * 60 * 24 * 365; // 1 year
      const token = await this.authService.setAuthTokenCache({
        cacheData: anonymousUser,
        authType: AuthTokenTypes.AUTH,
        ttl,
      });
      await this.cacheService.set(sessionCacheKey, { token, sessionId }, ttl);
      await this.addSessionCollaborator(sessionId, anonymousUser.id);
    }

    return `${this.configService.get(
      'client.baseUrl',
    )}/sessions/shared?token=${sessionCacheKey}`;
  }

  async validateSharedSessionToken(sessionToken: string) {
    const data = await this.cacheService.get(sessionToken);
    console.log({ sessionToken });
    if (!data) {
      throw new NotFoundException('Invalid token!');
    }

    return { token: data.token, sessionId: data.sessionId };
  }

  async revokeAnonymousSessionSharing(sessionId: number, account: Account) {
    const session = await this.sessionRepository.findOneOrFail(sessionId);
    if (!this.isSessionOwner(session, account)) {
      throw new NotAcceptableException('Sorry! You must be the session owner.');
    }
    const [sessionCacheKey, anonymousAccountId] =
      await this.getSessionSharingCacheKey(session.id);
    await this.cacheService.remove(sessionCacheKey);
    await this.removeSessionCollaborator(
      sessionId,
      anonymousAccountId,
      account,
    );
  }

  async acceptSessionCollaborationRequest(
    inviteHash: string,
    account: Account,
  ) {
    const data = await this.verifyCollaborationInviteToken(inviteHash, account);
    await this.addSessionCollaborator(data.sessionId, account.id);
    await this.sessionInviteRepository.update(
      { sessionId: data.sessionId, token: inviteHash },
      { status: InviteStatus.ACCEPTED },
    );

    await this.cacheService.remove(inviteHash);
    const session = await this.validateSessionComm(data.sessionId, account);
    // create chat membership
    await this.commsProvider.joinChat(
      account.comms.aws_chime.identity,
      session.comms.aws_chime.chatChannelArn,
    );
  }

  async addSessionCollaborator(sessionId: number, accountId: number) {
    await this.sessionRepository
      .createQueryBuilder()
      .relation(Session, 'collaborators')
      .of(sessionId)
      .addAndRemove(accountId, accountId);
  }

  async removeSessionCollaborator(
    sessionId: number,
    accountId: number,
    account: Account,
  ) {
    const session = await this.sessionRepository.findOneOrFail(sessionId);
    if (!this.isSessionOwner(session, account)) {
      throw new NotAcceptableException('Sorry! You must be the session owner.');
    }

    await this.sessionRepository
      .createQueryBuilder()
      .relation(Session, 'collaborators')
      .of(sessionId)
      .remove(accountId);
  }

  async removeAllSessionCollaborators(sessionId: number, account: Account) {
    const session = await this.sessionRepository.findOneOrFail(sessionId);
    if (!this.isSessionOwner(session, account)) {
      throw new NotAcceptableException('Sorry! You must be the session owner.');
    }

    await this.sessionCollaboratorRepository.delete({ sessionId });
  }

  async declineSessionCollaboration(inviteHash: string, sessionId: number) {
    const invitation = await this.sessionInviteRepository.update(
      { sessionId, token: inviteHash },
      { status: InviteStatus.DECLINED },
    );
    if (invitation) {
      await this.cacheService.remove(inviteHash);
    }
  }

  async cancelSessionCollaborationRequest(inviteId: number, account: Account) {
    const invite = await this.sessionInviteRepository.findOneOrFail(inviteId);
    await this.verifyCollaborationInviteToken(invite.token, account);

    await this.sessionInviteRepository.update(
      { id: inviteId },
      { status: InviteStatus.CANCELLED },
    );

    await this.cacheService.remove(invite.token);
  }

  async verifyCollaborationInviteToken(inviteHash: string, account: Account) {
    const data = await this.cacheService.get(inviteHash);
    if (!data) {
      throw new UnauthorizedException('Invalid/Expired invite token!');
    } else if (account.email !== data.email || !account.specialist) {
      throw new UnauthorizedException(
        'Unauthorized account to cancel this invitation!',
      );
    }

    return data;
  }

  async addNote(
    sessionId: number,
    item: CreateSessionNoteDto,
    account: Account,
  ) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['collaborators', 'patient'],
    });
    if (
      account.isAnonymous ||
      !session ||
      !this.isCollaborator(session, session.collaborators, account)
    ) {
      throw new NotAcceptableException('Unauthorized/Invalid session!');
    }

    return this.sessionNoteRepository.save({
      body: item.body,
      creatorId: account.id,
      sessionId,
    });
  }

  async updateNote(
    noteId: number,
    item: CreateSessionNoteDto,
    account: Account,
  ) {
    const sessionNote = await this.sessionNoteRepository.findOne({
      where: { id: noteId },
      relations: ['session'],
    });
    if (
      account.isAnonymous ||
      !sessionNote ||
      sessionNote.session.creatorId !== account.id
    ) {
      throw new NotAcceptableException('Unauthorized/Invalid session!');
    }

    return this.sessionNoteRepository.update(
      { id: noteId },
      { body: item.body },
    );
  }

  async getSessionReports(
    id: number,
    { limit, page, searchText }: SearchSessionDto,
    account: Account,
  ) {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['collaborators', 'patient'],
    });
    if (
      !session ||
      !this.isCollaborator(session, session.collaborators, account)
    ) {
      throw new NotFoundException('Session report not found!');
    }

    return this.paginate(
      this.sessionReportRepository,
      { limit, page },
      {
        where: { sessionId: id },
        relations: ['session', 'session.reportTemplate', 'specialist'],
      },
    );
  }

  async getSessionReport(id: number, sessionId: number, account: Account) {
    const report = await this.sessionReportRepository.findOne({
      where: { id, sessionId },
      relations: [
        'session',
        'session.collaborators',
        'session.patient',
        'session.reportTemplate',
        'specialist',
      ],
    });
    if (
      !report ||
      !this.isCollaborator(
        report.session,
        report.session.collaborators,
        account,
      )
    ) {
      throw new NotFoundException('Session report not found!');
    }

    return report;
  }

  async getInvitations(id: number, account: Account) {
    if (account.isAnonymous) {
      throw new UnauthorizedException();
    }

    return await this.sessionInviteRepository.find({
      where: { sessionId: id },
    });
  }

  async addSessionReport(sessionId: number, report: any, account: Account) {
    // find
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['collaborators', 'patient'],
    });
    if (
      account.isAnonymous ||
      !session ||
      !this.isCollaborator(session, session.collaborators, account)
    ) {
      throw new NotAcceptableException('Unauthorized/Invalid session!');
    }

    const specialist = await this.specialistRepository.findOne({
      accountId: account.id,
    });
    if (!specialist) {
      throw new NotAcceptableException(
        'Only a specialist is allowed to add a session report',
      );
    }

    return (
      this.sessionReportRepository
        .createQueryBuilder()
        .insert()
        .values({
          sessionId,
          specialistId: specialist.id,
          report,
        })
        // .orUpdate(['report'], ['specialistId', 'sessionId'])
        .execute()
    );
  }

  async getSessionChatRoom(sessionId: number, account: Account) {
    const session = await this.validateSessionComm(sessionId, account);
    const wsLink = await this.chatService.getWebSocketLink(
      account.comms.aws_chime.identity,
    );

    return {
      wsLink,
      chatRoom: session.comms.aws_chime.chatChannelArn,
    };
  }

  async getSessionChatMessages(
    sessionId: number,
    pagination: PaginationCursorOptionsDto,
    account: Account,
  ) {
    const session = await this.validateSessionComm(sessionId, account);

    return this.chatService
      .setUser({ arn: account.comms.aws_chime.identity, alias: account.alias })
      .getMessages(session.comms.aws_chime.chatChannelArn, pagination);
  }

  async sendSessionChatMessage(
    sessionId: number,
    message: string,
    account: Account,
  ) {
    if (account.isAnonymous) {
      throw new UnauthorizedException();
    }
    const session = await this.validateSessionComm(sessionId, account);

    return this.chatService
      .setUser({ arn: account.comms.aws_chime.identity, alias: account.alias })
      .sendMessage(session.comms.aws_chime.chatChannelArn, message);
  }

  async joinSessionMeeting(sessionId: number, account: Account) {
    const session = await this.validateSessionComm(sessionId, account);
    const joinMeeting = async () => {
      const attendee = await this.meetService
        .setUser({
          arn: account.comms.aws_chime.identity,
          alias: account.alias,
        })
        .joinMeeting(session.comms.aws_chime.meetChannel.MeetingId);

      return {
        ...attendee,
        Meeting: session.comms.aws_chime.meetChannel,
      };
    };

    try {
      return await joinMeeting();
    } catch (error) {
      if (error.name === 'NotFound') {
        const { meetChannel } = await this.setupSessionCommsChannels(
          account,
          session.alias,
        );

        await this.sessionRepository.update(session.id, {
          comms: {
            [CommsProviders.AWS_CHIME]: {
              ...session.comms?.[CommsProviders.AWS_CHIME],
              meetChannel,
            },
          },
        });
        session.comms[CommsProviders.AWS_CHIME] = {
          ...session.comms?.[CommsProviders.AWS_CHIME],
          meetChannel,
        };

        return joinMeeting();
      }
      throw new ServiceUnavailableException(
        'Oooops! Something went wrong, we cannot connect you.',
      );
    }
  }

  public async setupSessionCommsChannels(account: Account, name: string) {
    const userArn = account.comms.aws_chime.identity;
    const [meetChannel, chatChannel] = await Promise.all([
      this.commsProvider.startMeeting(name),
      this.commsProvider.startChat([userArn], name),
    ]);

    return {
      chatChannelArn: chatChannel.ChannelArn,
      meetChannel: meetChannel.Meeting,
    };
  }

  async leaveSessionMeeting(sessionId: number, account: Account) {
    // end meeting if no other attendees
    // unset session.comms.aws.meetingId
    const session = await this.validateSessionComm(sessionId, account);

    await this.meetService
      .setUser({ arn: account.comms.aws_chime.identity, alias: account.alias })
      .leaveMeeting(session.comms.aws_chime.meetChannel.MeetingId);

    const remainingAttendees = await this.meetService.getAttendees(
      session.comms.aws_chime.meetChannel.MeetingId,
    );
    if (!remainingAttendees.length) {
      // @TODO delete the meeting when session has been concluded
      // this.meetService.endMeeting(session.comms.aws_chime.meetChannelArn);
      // @TODO update session.comms.*.meetingArn
      // this.sessionRepository.update(sessionId, { comms:  })
    }
  }

  private async getSessionSharingCacheKey(
    sessionId: number,
  ): Promise<[string, number]> {
    const anonymousUser = await this.accountRepository.findOne({
      where: { isAnonymous: true },
    });
    const cacheKey = AppUtilities.encode(`${sessionId}-${anonymousUser.id}`);

    return [cacheKey, anonymousUser.id];
  }

  private async validateSessionComm(sessionId: number, account: Account) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['collaborators', 'patient'],
    });
    if (
      !session ||
      !session.comms.aws_chime?.chatChannelArn ||
      !session.comms.aws_chime?.meetChannel
    ) {
      throw new ServiceUnavailableException(
        'Session comms configuration not setup!',
      );
    } else if (!this.isCollaborator(session, session.collaborators, account)) {
      throw new NotAcceptableException('Session access denied!');
    }

    return session;
  }
}
