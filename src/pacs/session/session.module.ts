import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { SessionNoteModule } from './session-note/session-note.module';

@Module({
  providers: [SessionService],
  controllers: [SessionController],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Session]), SessionNoteModule],
})
export class SessionModule {}
