export const QUEUE = 'messaging:sms';

export enum JOBS {
  SEND_SMS = 'sendSMS',
  FINALIZE_SMS_BILLING = 'finalizeSmsBilling',
  LOG_RECIPIENT_SMS_ENTRIES = 'logRecipientSmsEntries',
  LOG_RECIPIENT_SMS_ENTRY = 'logRecipientSmsEntry',
  PROCESS_SMS_NOTIFICATION = 'processSmsNotification',
}
