import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { BaseQueueProcessor } from '../../base/queue';
import { SmsService } from '../sms.service';
import { JOBS, QUEUE } from '../constants';
import {
  QueueSmsScheduleJobAttribs,
  QueueRecipientSmsJobAttribs,
} from '../interfaces';

@Processor(QUEUE)
export class SmsQueueConsumer extends BaseQueueProcessor {
  protected logger: Logger;

  constructor(private smsService: SmsService) {
    super();
    this.logger = new Logger('SmsQueueConsumer');
  }

  @Process({ name: JOBS.LOG_RECIPIENT_SMS_ENTRY })
  async logRecipientSmsEntry({ data }: Job<QueueRecipientSmsJobAttribs>) {
    console.log('Create smsLog entry...');

    return this.smsService.queueSmsRequest(data);
  }

  @Process({ name: JOBS.LOG_RECIPIENT_SMS_ENTRIES })
  async logRecipientSmsEntries({ data }: Job<QueueSmsScheduleJobAttribs>) {
    console.log('Create sms entries...');

    return this.smsService.queueSmsSchedule(data);
  }
}
