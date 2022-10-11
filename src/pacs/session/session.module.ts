import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from '../../account/specialist/specialist.entity';
import { CommsModule } from '../../comms/comms.module';
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
    TypeOrmModule.forFeature([Session, SessionNote, SessionReport, Specialist]),
  ],
  exports: [TypeOrmModule],
})
export class SessionModule {}
