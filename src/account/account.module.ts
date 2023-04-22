import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionInvite } from '../pacs/session/session-invite/session-invite.entity';
import { SessionInviteService } from '../pacs/session/session-invite/session-invite.service';
import { AccountController } from './account.controller';
import { Account } from './account.entity';
import { AccountService } from './account.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account, SessionInvite])],
  providers: [AccountService, SessionInviteService],
  controllers: [AccountController],
  exports: [AccountService, TypeOrmModule],
})
export class AccountModule {}
