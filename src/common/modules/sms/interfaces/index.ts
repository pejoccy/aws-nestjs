export enum BillingStatus {
  DECLINED = 'declined',
  CHARGED = 'charged',
  PENDING = 'pending',
  PROCESSED = 'processed',
}

export enum SMSProviders {
  DOT_GO = 'dot_go',
  HOLLA_TAGS = 'holla_tags',
}

export interface SentMessageInfo {
  ok: boolean;
  raw: any;
  id?: string;
  timestamp?: string;
}

export interface SendSMSOptions {
  id: string;
  to: string | string[];
  body: string;
  callbackUrl?: string;
  senderMask?: string;
}

export interface SMSNotificationInfo {
  id: string;
  to: string;
  ref: string;
  time?: number;
  price: string;
  status?: string;
  billingStatus: BillingStatus;
}

export interface SMSGetBalanceResult {
  balance: number;
}

export interface SendSmsJobAttribs {
  ref: string;
  message: string;
  recipients: string[];
  senderMask?: string;
  scheduleId?: string;
}

export interface SMSProvider {
  id: SMSProviders;
  send(data: SendSMSOptions): Promise<SentMessageInfo>;
  parseDeliveryInfo(deliveryInfo: any): SMSNotificationInfo;
  getNotificationCallbackUrl(msg: SendSmsJobAttribs): string;
  getBalance?(): Promise<SMSGetBalanceResult>;
}

export interface FinalizeSmsBillingJobAttribs {
  smsLogId: string;
}

export interface QueueRecipientSmsJobAttribs {
  scheduleId: string;
  to: string;
  reference: string;
  senderMask?: string;
}

export interface QueueSmsScheduleJobAttribs {
  scheduleId: string;
  senderMask?: string;
}

export interface ProcessSmsNotificationJobAttribs {
  body: string;
  provider: SMSProviders;
}
