export const FILE_QUEUE = 'pacs:files';

export enum JOBS {
  UPLOAD_FILE = 'uploadFile',
}

export interface UploadFileJobAttribs {
  sessionId: number;
  fileIds?: number[];
}
