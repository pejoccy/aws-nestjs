import { Module } from '@nestjs/common';
import { SessionNoteService } from './session-note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../../account/account.entity';
import { SessionNote } from './session-note.entity';

@Module({
  providers: [SessionNoteService],
  controllers: [],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([SessionNote, Account])],
})
export class SessionNoteModule {}
