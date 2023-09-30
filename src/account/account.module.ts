import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChimeCommsProvider } from '../comms/providers/chime';
import { SessionInvite } from '../pacs/session/session-invite/session-invite.entity';
import { SessionInviteService } from '../pacs/session/session-invite/session-invite.service';
import { AccountController } from './account.controller';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { BusinessModule } from './business/business.module';
import { PatientModule } from './patient/patient.module';
import { SpecialistModule } from './specialist/specialist.module';

@Global()
@Module({
  imports: [
    BusinessModule,
    PatientModule,
    SpecialistModule,
    TypeOrmModule.forFeature([Account, SessionInvite]),
  ],
  providers: [AccountService, ChimeCommsProvider, SessionInviteService],
  controllers: [AccountController],
  exports: [AccountService, TypeOrmModule],
})
export class AccountModule {}
