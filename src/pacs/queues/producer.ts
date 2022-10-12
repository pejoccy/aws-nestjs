import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { JOBS, FILE_QUEUE, UploadFileJobAttribs } from './interfaces';

@Injectable()
export class FileQueueProducer {
  constructor(
    @InjectQueue(FILE_QUEUE)
    private readonly fileQueue: Queue,
  ) {}

  async uploadFile(data: UploadFileJobAttribs) {
    return this.fileQueue.add(JOBS.UPLOAD_FILE, data, {
      removeOnComplete: true,
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}
