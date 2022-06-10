import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { BaseQueueProcessor } from '../../../base/queue';
import { SmsService } from '../sms.service';
import { JOBS, QUEUE_DOTGO } from '../constants';
import { SendSmsJobAttribs } from '../interfaces';

@Processor(QUEUE_DOTGO)
export class SmsQueueConsumerDotGo extends BaseQueueProcessor {
  protected logger: Logger;

  constructor(private smsService: SmsService) {
    super();
    this.logger = new Logger('SmsQueueConsumerDotGo');
  }

  @Process({
    name: JOBS.SEND_SMS,
    concurrency: Number(process.env.SMS_SEND_WORKER_CONCURRENCY || 10),
  })
  async sendSMS({ data }: Job<SendSmsJobAttribs>) {
    console.log('Send queued sms.....');

    return this.smsService.sendQueuedSMS(data);
  }
}
