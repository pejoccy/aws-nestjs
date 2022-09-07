import { Module } from '@nestjs/common';
import { ChimeCommsProvider } from '../providers/chime';
import { ChatService } from './chat.service';

@Module({
  imports: [],
  providers: [ChatService, ChimeCommsProvider],
  controllers: [],
  exports: [ChatService],
})
export class ChatModule {}
