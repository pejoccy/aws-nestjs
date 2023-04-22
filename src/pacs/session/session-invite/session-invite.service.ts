import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../../account/account.entity';
import { BaseService } from '../../../common/base/service';
import { GetAccountInvitationsDto } from './dto/get-account-invitations.dto';
import { SessionInvite } from './session-invite.entity';

@Injectable()
export class SessionInviteService extends BaseService {
  constructor(
    @InjectRepository(SessionInvite)
    private sessionInviteRepository: Repository<SessionInvite>,
  ) {
    super();
  }

  async getInvitations(
    { status, ...options }: GetAccountInvitationsDto,
    account: Account,
  ) {
    if (account.isAnonymous) {
      throw new UnauthorizedException('Unauthorized to view invitations.');
    }

    return await this.paginate(this.sessionInviteRepository, options, {
      where: { inviteeEmail: account.email, status },
      relations: ['session', 'session.patient'],
    });
  }
}
