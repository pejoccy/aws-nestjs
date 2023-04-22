import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { GetAccount } from '../common/decorators/get-user-decorator';
import { GetAccountInvitationsDto } from '../pacs/session/session-invite/dto/get-account-invitations.dto';
import { SessionInviteService } from '../pacs/session/session-invite/session-invite.service';
import { Account } from './account.entity';

@ApiBearerAuth()
@ApiTags('Account')
@Controller('accounts')
@UseGuards(PermissionGuard)
export class AccountController {
  constructor(private sessionInviteService: SessionInviteService) {}

  @Get('/invitations')
  async getSession(
    @Query() dto: GetAccountInvitationsDto,
    @GetAccount() account: Account,
  ) {
    return this.sessionInviteService.getInvitations(dto, account);
  }
}
