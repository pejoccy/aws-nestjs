import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { BaseQueueProcessor } from '../../common/base/queue';
import { PacsService } from '../pacs.service';
import { JOBS, FILE_QUEUE, UploadFileJobAttribs } from './interfaces';

@Processor(FILE_QUEUE)
export class FileQueueConsumer extends BaseQueueProcessor {
  protected logger: Logger;

  constructor(private pacsService: PacsService) {
    super();
    this.logger = new Logger('FileQueueConsumer');
  }

  @Process({ name: JOBS.UPLOAD_FILE })
  async uploadFile({ data }: Job<UploadFileJobAttribs>) {
    console.log('Upload file...');

    return this.pacsService.processFileUploadJob(data);
  }
}
