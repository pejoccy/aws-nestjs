import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../../common/base/service';
import { Repository } from 'typeorm';
import { SessionNote } from './session-note.entity';

@Injectable()
export class SessionNoteService extends BaseService {
  constructor(
    @InjectRepository(SessionNote)
    private sessionNoteRepository: Repository<SessionNote>,
  ) {
    super();
  }
}
