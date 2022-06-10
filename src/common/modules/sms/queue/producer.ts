import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue, JobOptions } from 'bull';
import { JOBS, QUEUE, QUEUE_DOTGO } from '../constants';
import {
  QueueRecipientSmsJobAttribs,
  ProcessSmsNotificationJobAttribs,
  SendSmsJobAttribs,
} from '../interfaces';

@Injectable()
export class SmsQueueProducer {
  constructor(
    @InjectQueue(QUEUE)
    private readonly smsQueue: Queue,
  ) {}

  async sendSMS(data: SendSmsJobAttribs) {
    return this.smsQueue.add(JOBS.SEND_SMS, data, {
      removeOnComplete: true,
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }

  async queueRecipientSms(data: QueueRecipientSmsJobAttribs) {
    return this.addToQueue(JOBS.LOG_RECIPIENT_SMS_ENTRY, data, {
      removeOnComplete: true,
      priority: 20,
    });
  }

  async processCarrierSmsEventCallback(data: ProcessSmsNotificationJobAttribs) {
    return this.addToQueue(JOBS.PROCESS_SMS_NOTIFICATION, data, {
      attempts: 2,
      priority: 50,
      backoff: {
        type: 'exponential',
        delay: 10000,
      },
      removeOnComplete: true,
    });
  }

  private async addToQueue(jobName: JOBS, data: any, opts?: JobOptions) {
    return this.smsQueue.add(jobName, data, opts);
  }
}
