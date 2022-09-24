import { Injectable, Scope } from '@nestjs/common';
import { ChimeCommsProvider } from '../providers/chime';

@Injectable({ scope: Scope.REQUEST })
export class MeetService {
  private userArn: string;

  constructor(private meetServer: ChimeCommsProvider) {}

  setUserArn(userArn: string) {
    this.userArn = userArn;
    return this;
  }

  async getAttendees(meetingId: string) {
    return this.meetServer.getAttendees(meetingId);
  }

  async joinMeeting(meetingId: string) {
    return this.meetServer.addAttendee(meetingId, this.userArn);
  }

  async leaveMeeting(meetingId: string) {
    return this.meetServer.removeAttendee(meetingId, this.userArn);
  }
  
  async endMeeting(meetingId: string) {
    return this.meetServer.endMeeting(meetingId);
  }
}