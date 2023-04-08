import { NotAcceptableException } from '@nestjs/common';

export const imageFileFilter = (req, file, callback) => {
  if (
    !String(file.originalname)
      .toLowerCase()
      .match(/\.(png|jpeg|jpg|bmp)$/)
  ) {
    return callback(
      new NotAcceptableException('Only image files are allowed!'),
      false,
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
};

export type AuthTokenOptions = {
  authType: AuthTokenTypes;
  cacheData?: any;
  ttl?: number;
  refreshTokenTtl?: number;
  cacheKey?: string;
  autoRefreshToken?: boolean;
};

export enum AccountTypes {
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

export enum FeatureSlugs {
  SESSION = 'session',
  SESSION_FILES = 'session_files',
  SPECIALIST_INVITES = 'specialist_invites',
  NON_SPECIALIST_INVITES = 'non_specialist_invites',
  ALLOTED_FILE_STORAGE = 'alloted_file_storage',
  SESSION_RETENTION_PERIOD = 'session_retention_period',
  CHAT = 'chat',
  VIDEO = 'video',
  VIEW_PEER_REVIEWS = 'view_peer_reviews',
  OTHER_PEER_REVIEW = 'other_peer_review',
  AI_DIAGNOSTICS = 'ai_diagnostics',
  ANALYTICS = 'analytics',
}

export enum FeatureUnits {
  AGGREGATE = 'aggregate',
  DURATION = 'duration',
  VALUE = 'value',
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
  SKIN = 'skin',
}

export enum ResourcePermissions {
  READ_ONLY = 'read-only',
  READ_WRITE = 'read-write',
}

export enum InviteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  CANCELLED = 'cancelled',
  DECLINED = 'declined',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
}

export enum BusinessCategories {
  HOSPITAL = 'hospital',
  CLINIC = 'clinic',
  LABORATORY = 'laboratory',
  RADIOLOGY = 'radiology',
  DIAGNOSTICS = 'diagnostics',
}

export enum CommsProviders {
  AWS_CHIME = 'aws_chime',
}

export type IChimeMeeting = {
  MeetingId: string;
  MediaRegion: string;
  MediaPlacement: {
    AudioHostUrl: string;
    SignalingUrl: string;
    ScreenDataUrl: string;
    TurnControlUrl: string;
    AudioFallbackUrl: string;
    ScreenSharingUrl: string;
    ScreenViewingUrl: string;
    EventIngestionUrl: string;
  };
  ExternalMeetingId: string;
};
