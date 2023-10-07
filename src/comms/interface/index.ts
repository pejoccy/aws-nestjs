import { PaginationCursorOptionsDto } from '../../common/dto/pagination-cursor-options.dto';

export enum ActivityType {
  JOINED = 'joined',
  LEFT = 'left',
}

export type IUser = {
  arn: string;
  alias: string;
};

export abstract class CommsBase {
  protected user: IUser;

  setUser(user: IUser) {
    this.user = user;
    return this;
  }
}

export interface ChatServer {
  getChats(
    userArn: string,
    pagination: PaginationCursorOptionsDto,
  ): Promise<any>;
  startChat(inviteesArn: string[], name: string): Promise<any>;
  findChat?(name: string): Promise<any>;
  archiveChat?(chatArn: string): Promise<any>;
  deleteChat?(chatArn: string): Promise<any>;

  getMessages(
    userArn: string,
    chatArn: string,
    pagination: PaginationCursorOptionsDto,
  ): Promise<any>;
  sendMessage(userArn: string, chatArn: string, msg: string): Promise<any>;
  sendFile?(userArn: string, chatArn: string, file: any): Promise<any>;
  updateMessage?(userArn: string, msgId: string, msg: string): Promise<any>;
  deleteMessage?(userArn: string, msgId: string): Promise<any>;
}

export interface MeetingServer {
  startMeeting(ref: string, attendees?: string[]): Promise<any>;
  endMeeting(id: string): Promise<any>;
  getAttendees(
    meetingId: string,
    pagination: PaginationCursorOptionsDto,
  ): Promise<any>;
  addAttendees?(meetingId: string, attendees: string[]): Promise<any>;
  removeAttendee?(meetingId: string, attendeeId: string): Promise<any>;
}
