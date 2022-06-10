export interface FileAttachmentOptions {
  filename: string;
  content: string;
}

export interface SendMailOptions {
  to: string | string[];
  html: string;
  subject?: string;
  from?: string;
  attachments?: FileAttachmentOptions[];
}
