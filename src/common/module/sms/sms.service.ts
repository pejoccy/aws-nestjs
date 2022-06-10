import {
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { AppUtilities } from '../../../app.utilities';
import { BaseService } from '../../base/service';
import { PG_DB_ERROR_CODES } from '../../interfaces';
import {
  QueueSmsScheduleJobAttribs,
  QueueRecipientSmsJobAttribs,
  SendSmsJobAttribs,
} from './interfaces';
import { SmsProviderFactory } from './providers';
import { SmsQueueProducer } from './queue/producer';

const DEFAULT_COUNTRY_CODE = 'NG';

@Injectable()
export class SmsService extends BaseService {

  constructor(
    private smsProviderFactory: SmsProviderFactory,
    private smsQueue: SmsQueueProducer,
    private appUtilities: AppUtilities
  ) {
    super();
  }

  async send(data: any/*SendSmsDTO*/, authorized: any) {
    const queryRunner = await this.startTransaction();
    try {
      let config = authorized.tenant?.config;
      if (!authorized.tenant) {
        config = authorized.app?.config;
      }
      const senderMask = config?.sms?.senderId || undefined;
      if (config?.sms?.status === false) {
        throw new NotAcceptableException('Service has been disabled!');
      }
      const ref = data.ref || this.appUtilities.generateUniqueKey();

      await queryRunner.commitTransaction();

      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === PG_DB_ERROR_CODES.CONFLICT) {
        throw new NotAcceptableException('Duplicate message ref!');
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async sendQueuedSMS(data: SendSmsJobAttribs) {
    const smsProvider = this.smsProviderFactory.getInstance();

    const message = await smsProvider.send({
      id: data.ref,
      body: data.message,
      to: data.recipients,
      senderMask: data.senderMask,
      callbackUrl: smsProvider.getNotificationCallbackUrl(data),
    });

    if (message?.ok) {
      return message;
    }

    throw message?.raw || message;
  }

  async queueSmsSchedule({
    scheduleId,
    ...data
  }: QueueSmsScheduleJobAttribs): Promise<any> {
    // eslint-disable-next-line no-restricted-syntax
    for (const recipient of []) {
      const recipientTrimmed = recipient.replace(/[^0-9]/, '');

      this.smsQueue.queueRecipientSms({
        ...data,
        scheduleId: 'schedule.id',
        to: recipient,
        reference: 'Adf',
      });
    }

    return undefined;
  }

  async queueSmsRequest({
    to: recipient,
    reference,
    senderMask,
  }: QueueRecipientSmsJobAttribs) {
    console.log('this.queueSmsRequest.....');

    try {
      // send SMS here
      await this.smsQueue.sendSMS({
        ref: reference,
        message: 'message',
        recipients: [recipient],
        senderMask,
      });

      return;
    } catch (e) {
      if (e.code === PG_DB_ERROR_CODES.CONFLICT) {
        // filter out duplicates
        console.log('just filtered out duplicate...', recipient);
        return undefined;
      }
      console.error(e);
      throw e;
    }
  }
}
