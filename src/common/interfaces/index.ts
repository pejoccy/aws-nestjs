import { NotAcceptableException } from "@nestjs/common";

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
    return callback(
      new NotAcceptableException('Only image files are allowed!'),
      false
    );
  }
  return callback(null, true);
};

export const PASSWORD_POLICY_REGEX =
  '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})';

export enum AuthTokenTypes {
  AUTH = 'auth',
  RESET = 'reset',
  SETUP = 'setup',
}

export type CachedAuthData<T = any> = {
  otp: string;
  authType: AuthTokenTypes;
  data?: T;
}

export enum UserRoles {
  PATIENT = 'patient',
  SPECIALIST = 'specialist',
  BUSINESS = 'business',
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

export interface JwtPayload {
  authType?: AuthTokenTypes;
}
export interface MessageBulkData {
  recipients: string | string[];
  message: string;
  subject?: string;
}

export enum SpecialistCategories {
  SPECIALIST = 'specialist',
  UNDERGRADUATE = 'undergraduate',
  POSTGRADUATE = 'postgraduate',
}

export enum ResourcePermissions {
  SCAN_AND_UPLOAD = 'scan-and-upload',
  BULK_SCAN_AND_UPLOAD = 'bulk-scan-and-upload',
  VIDEO_AUDIO_CALL_AND_RECORDING = 'video-audio-call-and-recording',
  ADD_MULTIPLE_PAYMENT_CARDS = 'add-multiple-payment-cards',
  SHARE_AND_GRANT_ACCESS = 'share-and-grant-access',
  VIEW_DETAILED_REPORT = 'view-detailed-report',
  DOWNLOAD_EXPORT = 'download-and-export',
}

export enum TimeUnits {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

export enum ShareOptions {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum FileModality {
  X_RAY = 'x-ray',
  MRI = 'mri',
  CT_SCAN = 'ct-scan',
}

export enum ResourcePermissions {
  READ_ONLY = 'read-only',
  READ_WRITE = 'read-write',
}
