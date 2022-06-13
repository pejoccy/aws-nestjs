import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import smpp from 'smpp';
import { AppUtilities } from '../../../app.utilities';
import {
  BillingStatus,
  SendSMSOptions,
  SentMessageInfo,
  SMSNotificationInfo,
  SMSGetBalanceResult,
  SMSProvider,
  SMSProviders,
  SendSmsJobAttribs,
} from '../interfaces';

enum MessageTypes {
  NORMAL_SMS,
  FLASH_SMS,
  UNICODE_SMS,
}

interface ConfigOptions {
  user: string;
  pass: string;
  baseURL: string;
  senderMask: string;
  protocol: 'smpp' | 'http';
}

@Injectable()
export class HollaTagsSMSProvider implements SMSProvider {
  private httpClient: AxiosInstance;
  private smppSession: any;
  private config: ConfigOptions;

  constructor(
    configService: ConfigService,
    private appUtilities: AppUtilities
  ) {
    this.config = configService.get('messaging.sms.hollaTags');

    this.httpClient = axios.create({
      baseURL: `${this.config.baseURL}`,
      headers: { 'Content-Type': 'application/json' },
    });

    if (this.config.protocol === 'smpp') {
      this.setupSmppSession();
    }
  }

  get id() {
    return SMSProviders.HOLLA_TAGS;
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

  getBalance?(): Promise<SMSGetBalanceResult> {
    return this.httpClient.get('');
  }

  getNotificationCallbackUrl(msg: SendSmsJobAttribs): string {
    return this.appUtilities.getApiUrl(
      `sms/dlr/${SMSProviders.DOT_GO}/${msg.ref}`
    );
  }

  async send(data: SendSMSOptions): Promise<SentMessageInfo> {
    if (this.config.protocol === 'smpp') {
      return this.sendMessageSmpp(data);
    }

    try {
      const resp = await this.httpClient.post('/send', {
        to: data.to,
        from: data.senderMask || this.config.senderMask,
        msg: data.body,
        user: this.config.user,
        pass: this.config.pass,
        type: MessageTypes.NORMAL_SMS,
        message_uuid: data.id,
        enable_msg_id: true,
        callback_url: data.callbackUrl,
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

  private sendMessageSmpp(data: SendSMSOptions) {
    return new Promise<SentMessageInfo>(resolve => {
      this.smppSession.submit_sm(
        {
          // source_addr: data.,
          destination_addr: data.to,
          short_message: data.body,
        },
        (pdu: any) => {
          console.log('---->>> ', pdu, pdu.message_id);
          
          resolve({ ok: pdu.command_status == 0, raw: pdu });
        }
      );
    });
  }

  private setupSmppSession() {
    this.smppSession = new smpp.Session({ host: '', port: 9009 });
    
    let isConnected = false
    this.smppSession.on('connect', () => {
      isConnected = true;

      this.smppSession.bind_transceiver({
        system_id: 'USER_NAME',
        password: 'USER_PASSWORD',
        interface_version: 1,
       
        addr_ton: 1,
        addr_npi: 1,
      }, (pdu) => {
        if (pdu.command_status == 0) {
          console.log('Successfully bound')
        }

      })
    })

    this.smppSession.on('close', () => {
      console.log('smpp is now disconnected')

      if (isConnected) {
        this.smppSession.connect();    //reconnect again
      }
    })

    this.smppSession.on('error', error => {
      console.log('smpp error', error)
      isConnected = false;
    });
  }
}
