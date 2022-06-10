import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { AppUtilities } from '../../../../app.utilities';
import {
  BillingStatus,
  SendSMSOptions,
  SentMessageInfo,
  SMSNotificationInfo,
  SMSGetBalanceResult,
  SMSProvider,
  SMSProviders,
} from '../interfaces';

@Injectable()
export class DotGoSMSProvider implements SMSProvider {
  private httpClient: AxiosInstance;

  private senderMask: string;

  constructor(
    configService: ConfigService,
    private appUtilities: AppUtilities
  ) {
    const {
      baseURL,
      apiToken,
      accountId,
      senderMask,
    } = configService.get('messaging.sms.dotGo');
    this.senderMask = senderMask;

    this.httpClient = axios.create({
      baseURL: `${baseURL}/Accounts/${accountId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiToken,
      },
    });
  }

  get id() {
    return SMSProviders.DOT_GO;
  }

  parseDeliveryInfo(deliveryInfo: string): SMSNotificationInfo {
    const dlrMessage = JSON.parse(deliveryInfo);
    if (!dlrMessage) {
      throw new Error('Invalid delivery info');
    }
    let billed: BillingStatus = BillingStatus.PENDING;
    const price =
      !!dlrMessage.price &&
      // eslint-disable-next-line no-useless-escape
      Number(String(dlrMessage.price).replace(/[^0-9\.]/g, ''));
    if (price > 0) {
      billed = BillingStatus.CHARGED;
    } else if (
      ['invalid', 'dnd'].includes(dlrMessage.status) ||
      price === 0 ||
      dlrMessage.price === 'NGN0.00'
    ) {
      billed = BillingStatus.DECLINED;
    }

    return {
      id: dlrMessage.id,
      ref: dlrMessage.ref_id,
      status: dlrMessage.status,
      to: dlrMessage.to,
      price: dlrMessage.price,
      time: new Date(
        String(dlrMessage.event_timestamp).replace(' WAT', '')
      ).getTime(),
      billingStatus: billed,
    };
  }

  getBalance(): Promise<SMSGetBalanceResult> {
    throw new Error('Method not implemented.');
  }

  getNotificationCallbackUrl(): string {
    return this.appUtilities.getApiUrl(`sms/dlr/${SMSProviders.DOT_GO}`);
  }

  async send({
    callbackUrl,
    ...data
  }: SendSMSOptions): Promise<SentMessageInfo> {
    try {
      const resp = await this.httpClient.post('/Messages', {
        ...data,
        callback_url: callbackUrl,
        sender_mask: data.senderMask || this.senderMask,
      });
      if (resp?.data?.status !== 'ok') {
        throw resp as any;
      }

      return { ok: true, raw: resp.data };
    } catch (error) {
      console.error(error?.data || error);
      return { raw: error?.data, ok: false };
    }
  }
}
