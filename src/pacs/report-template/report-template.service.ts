import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/base/service';
import { ReportTemplate } from './report-template.entity';

@Injectable()
export class ReportTemplateService extends BaseService {
  constructor(
    @InjectRepository(ReportTemplate)
    protected sessionReportTemplateRepository: Repository<ReportTemplate>,
  ) {
    super();
  }
}
