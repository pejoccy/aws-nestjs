import { Injectable, Scope } from '@nestjs/common';
import { PaginationCursorOptionsDto } from '../../common/dto';
import { CommsBase } from '../interface';
import { ChimeCommsProvider } from '../providers/chime';

const hostname = 'node001.ue1.ws-messaging.chime.aws';

@Injectable({ scope: Scope.REQUEST })
export class ChatService extends CommsBase {
  constructor(private chatServer: ChimeCommsProvider) {
    super();
  }

  async getMessages(chatArn: string, pagination: PaginationCursorOptionsDto) {
    return this.chatServer.getMessages(this.user.arn, chatArn, pagination);
  }

  async sendMessage(chatArn: string, message: string) {
    return this.chatServer.sendMessage(this.user.arn, chatArn, message);
  }

  async getChats(pagination: PaginationCursorOptionsDto) {
    return this.chatServer.getChats(this.user.arn, pagination);
  }

  async getChat(chatArn: string) {
    return this.chatServer.findChat(chatArn);
  }

  async getWebSocketLink(userArn: string) {
    return this.chatServer.getConnectionWebsocketLink(userArn, hostname);
  }
}
