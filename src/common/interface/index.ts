export const PASSWORD_POLICY_REGEX =
  '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})';

export enum UserRoles {
  ADMIN = 'ADMIN',
}  

// eslint-disable-next-line  @typescript-eslint/naming-convention
export enum PG_DB_ERROR_CODES {
  CONFLICT = '23505',
  FOREIGN_KEY_VIOLATION = '23503',
  INTERNAL = '22P02',
}

export enum ResponseMessage {
  SUCCESS = 'Request Successful!',
}

export enum MessageStatus {
  ACCEPTED = 'accepted',
  DELIVERED = 'delivered',
  DND = 'dnd',
  FAILED = 'failed',
  QUEUED = 'queued',
  REJECTED = 'rejected',
  SENT = 'sent',
  UNDELIVERED = 'undelivered',
}

export enum MessageType {
  EMAIL = 'email',
  SMS = 'sms',
}

export enum MessageScheduleStatus {
  CANCELLED = 'cancelled',
  PENDING = 'pending',
  PROCESSED = 'processed',
  SCHEDULED = 'scheduled',
}

export interface MessageBulkData {
  recipients: string | string[];
  message: string;
  subject?: string;
}

export enum Currency {
  NGN = 'NGN',
}
