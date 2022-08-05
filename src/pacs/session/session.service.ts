import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../account/account.entity';
import { AppUtilities } from '../../app.utilities';
import { BaseService } from '../../common/base/service';
import { CacheService } from '../../common/cache/cache.service';
import { MailerService } from '../../common/mailer/mailer.service';
import { CreateSessionNoteDto } from './session-note/dto/create-session-note.dto';
import { InviteCollaboratorDto } from './dto/invite-collaborator.dto';
import { SearchSessionDto } from './dto/search-session.dto';
import { SessionNote } from './session-note/session-note.entity';
import { Session } from './session.entity';

@Injectable()
export class SessionService extends BaseService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(SessionNote)
    private sessionNoteRepository: Repository<SessionNote>,
    private appUtilities: AppUtilities,
    private mailService: MailerService,
    private cacheService: CacheService
  ) {
    super();
  }

  async getSessions(
    { limit, page, searchText }: SearchSessionDto,
    account: Account
  ) {
    return this.search(
      this.sessionRepository,
      ['name'],
      searchText,
      { limit, page },
      {
        relations: ['files', 'collaborators'],
        where: { creatorId: account.id },
      }
    );
  }

  async getSession(
   id: number,
    account: Account
  ) {
    const session = await this.sessionRepository.findOne({
      where: { id, creatorId: account.id },
      relations: [
        'files',
        'notes',
        'notes.createdBy',
        'notes.createdBy.specialist',
        'notes.createdBy.patient',
        'collaborators',
        'collaborators.specialist',
        'collaborators.specialist.specialization',
      ]
    });
    if (!session) {
      throw new NotFoundException('Session not found!');
    }

    return session;
  }
  
  async inviteCollaborator(
    sessionId: number,
    item: InviteCollaboratorDto,
    account: Account
  ) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['collaborators'],
    });
    if (!session || (
      !this.isCollaborator(session.collaborators, account) &&
      session.creatorId !== account.id &&
      session.patientId !== account.id
      )
    ) {
      throw new NotAcceptableException('Unauthorized/Invalid session!');
    }
    const inviteHash = this.appUtilities.generateShortCode()
    await this.cacheService.set(
      inviteHash,
      { ...item, invitedBy: account.id, sessionId },
      2 * 60 * 60 // 2 hrs
    );
    console.log({ inviteHash, sessionId });
    // send email
    this.mailService.sendInviteCollaboratorEmail(
      item.email,
      inviteHash,
      sessionId
    );
  }
  
  async acceptSessionCollaboration(inviteHash: string, account: Account) {
    const data = await this.cacheService.get(inviteHash);
    if (!data) {
      throw new UnauthorizedException('Invalid/Expired invitation!');
    } else if (account.email !== data.email || !account.specialist) {
      throw new UnauthorizedException(
        'Unauthorized account to accept invitation!'
      );
    }

    await this.sessionRepository
      .createQueryBuilder()
      .relation(Session, 'collaborators')
      .of(data.sessionId)
      .addAndRemove(account.id, account.id);

    await this.cacheService.remove(inviteHash);
  }

  async addNote(
    sessionId: number,
    item: CreateSessionNoteDto,
    account: Account
  ) {
    const session = await this.sessionRepository.findOne(sessionId);
    if (!session || (
      !this.isCollaborator(session.collaborators, account) &&
      session.creatorId !== account.id &&
      session.patientId !== account.id
    )) {
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
    account: Account
  ) {
    const sessionNote = await this.sessionNoteRepository.findOne({
      where: { id: noteId },
      relations: ['session', 'session.collaborators']
    });
    if (!sessionNote || (
      !this.isCollaborator(sessionNote?.session.collaborators, account) &&
      sessionNote.session.creatorId !== account.id &&
      sessionNote.session.patientId !== account.id
    )) {
      throw new NotAcceptableException('Unauthorized/Invalid session!');
    }

    return this.sessionNoteRepository.update(
      { id: noteId },
      { body: item.body }
    );
  }
}
