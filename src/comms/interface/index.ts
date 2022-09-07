import { PaginationCursorOptionsDto } from '../../common/dto';

export interface ChatServer {
  userArn: string;
  getChats(pagination: PaginationCursorOptionsDto): Promise<any>;
  startChat(inviteesArn: string[], name: string): Promise<any>;
  findChat?(name: string): Promise<any>;
  archiveChat?(chatArn: string): Promise<any>;
  deleteChat?(chatArn: string): Promise<any>;

  getMessages(
    chatArn: string,
    pagination: PaginationCursorOptionsDto
  ): Promise<any>;
  sendMessage(chatArn: string, msg: string): Promise<any>;
  sendFile?(chatArn: string, file: any): Promise<any>;
  updateMessage?(msgId: string, msg: string): Promise<any>;
  deleteMessage?(msgId: string): Promise<any>;
}

export interface MeetingServer {
  startMeeting(ref: string, attendees?: string[]): Promise<any>;
  endMeeting(id: string): Promise<any>;
  getAttendees(
    meetingId: string,
    pagination: PaginationCursorOptionsDto
  ): Promise<any>;
  addAttendees?(meetingId: string, attendees: string[]): Promise<any>;
  removeAttendee?(meetingId: string, attendeeId: string): Promise<any>;
}
