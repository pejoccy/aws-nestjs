import { Injectable, Scope } from '@nestjs/common';
import { CommsBase } from '../interface';
import { ChimeCommsProvider } from '../providers/chime';

@Injectable({ scope: Scope.REQUEST })
export class MeetService extends CommsBase {
  constructor(private meetServer: ChimeCommsProvider) {
    super();
  }

  async getAttendees(meetingId: string) {
    return this.meetServer.getAttendees(meetingId);
  }

  async joinMeeting(meetingId: string) {
    return this.meetServer.addAttendee(meetingId, this.user.alias);
  }

  async leaveMeeting(meetingId: string) {
    return this.meetServer.removeAttendee(meetingId, this.user.alias);
  }

  async endMeeting(meetingId: string) {
    return this.meetServer.endMeeting(meetingId);
  }
}
