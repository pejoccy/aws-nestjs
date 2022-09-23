import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AWS, {
  ChimeSDKIdentity,
  ChimeSDKMessaging,
  Chime,
  Endpoint,
  Credentials,
} from 'aws-sdk';
import crypto from 'crypto-js';
import moment from 'moment';
import { v4 } from 'uuid';
import { PaginationCursorOptionsDto } from '../../common/dto';
import { ChatServer, MeetingServer } from '../interface';

@Injectable()
export class ChimeCommsProvider implements ChatServer, MeetingServer {
  private chimeIdentity: ChimeSDKIdentity;
  private chimeMessaging: ChimeSDKMessaging;
  private chimeMeeting: Chime;
  protected _userArn: string;

  constructor(private config: ConfigService) {
    // @TODO bootstrap and set sessionArn
    this.setupCredentials();
    this.initMessagingSdk();
    this.initMeetingSdk();
  }

  async createIdentity(ref: string, name: string) {
    const aws = this.config.get('awsChime');
    const params: ChimeSDKIdentity.CreateAppInstanceUserRequest = {
      AppInstanceArn: aws.appInstanceArn,
      AppInstanceUserId: ref,
      Name: name,
      ClientRequestToken: v4(),
    };

    return this.chimeIdentity.createAppInstanceUser(params);
  }

  async startMeeting(ref: string, attendees?: string[]): Promise<any> {
    const aws = this.config.get('awsChime');
    if (!attendees || attendees.length <= 0) {
      const params: Chime.CreateMeetingRequest = {
        ClientRequestToken: v4(),
        MediaRegion: aws.region,
        ExternalMeetingId: ref,
      };
  
      return this.chimeMeeting.createMeeting(params).promise();
    }

    const params: Chime.CreateMeetingWithAttendeesRequest = {
      ClientRequestToken: v4(),
        MediaRegion: aws.region,
        ExternalMeetingId: ref,
        Attendees: attendees.map(attendee => ({ ExternalUserId: attendee })),
    };
    
    return this.chimeMeeting.createMeetingWithAttendees(params).promise();
  }

  async endMeeting(id: string): Promise<any> {
    const params: Chime.DeleteMeetingRequest = {
      MeetingId: id,
    };

    return this.chimeMeeting.deleteMeeting(params).promise();
  }

  async getAttendees(
    meetingId: string,
    pagination: PaginationCursorOptionsDto
  ): Promise<any> {
    const params: Chime.ListAttendeesRequest = {
      MeetingId: meetingId,
      NextToken: pagination.nextToken,
      MaxResults: pagination.limit,
    };

    return this.chimeMeeting.listAttendees(params).promise();
  }

  async addAttendees?(meetingId: string, attendees: string[]): Promise<any> {
    const params: Chime.BatchCreateAttendeeRequest = {
      MeetingId: meetingId,
      Attendees: attendees.map(attendee => ({ ExternalUserId: attendee })),
    };

    return this.chimeMeeting.batchCreateAttendee(params).promise();
  }
  
  async removeAttendee?(meetingId: string, attendeeId: string): Promise<any> {
    const params: Chime.DeleteAttendeeRequest = {
      MeetingId: meetingId,
      AttendeeId: attendeeId,
    };

    return this.chimeMeeting.deleteAttendee(params).promise();
  }

  get userArn() { return this._userArn }

  async startChat(inviteesArn: string[], name: string): Promise<any> {
    const aws = this.config.get('awsChime');

    const params: ChimeSDKMessaging.CreateChannelRequest = {
      AppInstanceArn: aws.appInstanceArn,
      ChimeBearer: aws.appInstanceAdminArn,
      Name: name,
      MemberArns: [this.userArn, ...inviteesArn],
      ClientRequestToken: v4(),
    }

    return this.chimeMessaging.createChannel(params).promise();
  }

  async getChats(pagination: PaginationCursorOptionsDto): Promise<any> {
    const aws = this.config.get('awsChime');

    const channelParams: ChimeSDKMessaging.ListChannelMembershipsForAppInstanceUserRequest  = {
      ChimeBearer: aws.appInstanceAdminArn,
      AppInstanceUserArn: this.userArn,
      MaxResults: pagination.limit,
      NextToken: pagination.nextToken,
    };

    return this
      .chimeMessaging
      .listChannelMembershipsForAppInstanceUser(channelParams)
      .promise();
  }

  async getMessages(
    chatArn: string,
    pagination: PaginationCursorOptionsDto
  ): Promise<any> {
    const params: ChimeSDKMessaging.ListChannelMessagesRequest = {
      ChannelArn: chatArn,
      ChimeBearer: this.userArn,
      MaxResults: pagination.limit,
      NextToken: pagination.nextToken,
      NotAfter: pagination.notAfter,
    };

    return this.chimeMessaging.listChannelMessages(params).promise();
  }

  async sendMessage(chatArn: string, msg: string): Promise<any> {
    const params: ChimeSDKMessaging.SendChannelMessageRequest = {
      ChimeBearer: this.userArn,
      ChannelArn: chatArn,
      Content: msg,
      ClientRequestToken: v4(),
      Persistence: "PERSISTENT",
      Type: "STANDARD",
    };

    return this.chimeMessaging.sendChannelMessage(params).promise();
  }

  async sendFile?(file: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async updateMessage?(id: string, msg: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async deleteMessage?(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  
  public getConnectionWebsocketLink(userArn: string, hostname: string) {
    const aws = this.config.get('awsChime');
    const currentMoment = moment();
    const amz_date = currentMoment.format('YYYYMMDDTHHmmSSZ');
    const dateStamp = currentMoment.format('YYYYMMDD');
    const method = "GET";
    const service = "chime";
    const region = aws.region;
    const canonical_uri = "/connect";
    const canonical_headers = "host:" + hostname.toLowerCase() + "\n";
    const signed_headers = "host";
    const algorithm = "AWS4-HMAC-SHA256";
    const credential_scope =
      dateStamp + "/" + region + "/" + service + "/" + "aws4_request";
  
    let canonical_querystring =
      "X-Amz-Algorithm=" +
      "AWS4-HMAC-SHA256" +
      "&" +
      "X-Amz-Credential=" +
      encodeURIComponent(`${aws.config.accessKeyId}/${credential_scope}`) +
      "&" +
      "X-Amz-Date=" +
      amz_date +
      "&" +
      "X-Amz-Expires=" +
      "3600" +
      "&" +
      "X-Amz-SignedHeaders=" +
      signed_headers +
      "&" +
      "sessionId=" +
      encodeURIComponent(String(v4()).replace(/\-/, '')) +
      "&" +
      "userArn=" +
      encodeURIComponent(userArn);
  
    const payload_hash = crypto.SHA256("");
    const canonical_request =
      method +
      "\n" +
      canonical_uri +
      "\n" +
      canonical_querystring +
      "\n" +
      canonical_headers +
      "\n" +
      signed_headers +
      "\n" +
      payload_hash;
  
    const string_to_sign =
      algorithm +
      "\n" +
      amz_date +
      "\n" +
      credential_scope +
      "\n" +
      crypto.SHA256(canonical_request);
  
    const signing_key = this.getSignatureKey(dateStamp);
    const signature = crypto
      .HmacSHA256(string_to_sign, signing_key)
      .toString(crypto.enc.Hex);
  
    canonical_querystring += "&X-Amz-Signature=" + signature;
  
    return "wss://" + hostname + canonical_uri + "?" + canonical_querystring;
  }

  private setupCredentials() {
    const awsConfig = this.config.get('awsChime.config');
    AWS.config.credentials = new Credentials(
      awsConfig.accessKeyId,
      awsConfig.secretAccessKey,
      null
    );
  }

  private initMessagingSdk() {
    const aws = this.config.get('awsChime');
    this.chimeMessaging = new ChimeSDKMessaging({
      credentials: aws.config,
      region: aws.region,
    });
  }

  private initMeetingSdk() {
    const aws = this.config.get('awsChime');
    this.chimeMeeting = new Chime({ region: aws.region });
    this.chimeMeeting.endpoint = new Endpoint(
      "https://service.chime.aws.amazon.com/console"
    );
  }

  private getSignatureKey(dateStamp: string) {
    const aws = this.config.get('awsChime');
    const sign = (key: any, msg: any) => crypto.HmacSHA256(msg, key);
  
    const newKey = "AWS4" + AWS.config.credentials.secretAccessKey;
    const kDate = sign(newKey, dateStamp);
    const kRegion = sign(kDate, aws.region);
    const kService = sign(kRegion, "chime");
    const kSigning = sign(kService, "aws4_request");
  
    return kSigning;
  }
}
