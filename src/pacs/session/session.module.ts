import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from '../../account/specialist/specialist.entity';
import { SessionNote } from './session-note/session-note.entity';
import { SessionReport } from './session-report/session-report.entity';
import { Session } from './session.entity';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  providers: [SessionService],
  controllers: [SessionController],
  exports: [TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([
      Session,
      SessionNote,
      SessionReport,
      Specialist
  ])],
})
export class SessionModule {}
