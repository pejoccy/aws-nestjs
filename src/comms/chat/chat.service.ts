import { Injectable } from '@nestjs/common';
import { PaginationCursorOptionsDto } from 'src/common/dto';
import { ChimeCommsProvider } from '../providers/chime';

@Injectable()
export class ChatService {
  constructor(private chatServer: ChimeCommsProvider) {}

  async getChats(pagination: PaginationCursorOptionsDto) {
    return this.chatServer.getChats(pagination);
  }
}