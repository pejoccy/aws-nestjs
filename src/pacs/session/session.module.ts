import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../account/account.entity';
import { Specialist } from '../../account/specialist/specialist.entity';
import { CommsModule } from '../../comms/comms.module';
import { SessionToCollaborator } from './session-collaborator/session-collaborator.entity';
import { SessionInvite } from './session-invite/session-invite.entity';
import { SessionNote } from './session-note/session-note.entity';
import { SessionReport } from './session-report/session-report.entity';
import { SessionController } from './session.controller';
import { Session } from './session.entity';
import { SessionService } from './session.service';

@Module({
  providers: [SessionService],
  controllers: [SessionController],
  imports: [
    CommsModule,
    TypeOrmModule.forFeature([
      Account,
      Session,
      SessionInvite,
      SessionNote,
      SessionReport,
      SessionToCollaborator,
      Specialist,
    ]),
  ],
  exports: [SessionService, TypeOrmModule],
})
export class SessionModule {}
