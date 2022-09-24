import { Injectable, Scope } from '@nestjs/common';
import { PaginationCursorOptionsDto } from '../../common/dto';
import { ChimeCommsProvider } from '../providers/chime';

const hostname = "node001.ue1.ws-messaging.chime.aws";

@Injectable({ scope: Scope.REQUEST })
export class ChatService {
  constructor(private chatServer: ChimeCommsProvider) {}

  setUserArn(userArn: string) {
    this.chatServer.setUserArn(userArn);
    return this;
  }

  async getMessages(chatArn: string, pagination: PaginationCursorOptionsDto) {
    return this.chatServer.getMessages(chatArn, pagination);
  }

  async sendMessage(chatArn: string, message: string) {
    return this.chatServer.sendMessage(chatArn, message);
  }

  async getChats(pagination: PaginationCursorOptionsDto) {
    return this.chatServer.getChats(pagination);
  }

  async getChat(chatArn: string) {
    return this.chatServer.findChat(chatArn);
  }

  async getWebSocketLink(userArn: string) {
    return this.chatServer.getConnectionWebsocketLink(userArn, hostname);
  }
}
