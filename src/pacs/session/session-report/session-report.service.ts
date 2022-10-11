import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/service';
import { SessionReport } from './session-report.entity';

@Injectable()
export class SessionReportService extends BaseService {
  constructor(
    @InjectRepository(SessionReport)
    protected sessionNoteRepository: Repository<SessionReport>,
  ) {
    super();
  }
}
