export enum FileStatus {
  PENDING = 'pending',
  UPLOAD_FAILED = 'upload-failed',
  UPLOADED = 'uploaded',
  UPLOADING = 'uploading',
  INVALID = 'invalid',
}

export enum FileStorageProviders {
  LOCAL = 'local',
  AWS = 'aws',
}
