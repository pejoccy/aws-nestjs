import { Module } from '@nestjs/common';
import { ChatService } from './chat/chat.service';
import { MeetService } from './meet/meet.service';
import { ChimeCommsProvider } from './providers/chime';
import { TimerService } from './timer/timer.service';

@Module({
  imports: [],
  providers: [ChatService, ChimeCommsProvider, MeetService, TimerService],
  exports: [ChatService, ChimeCommsProvider, MeetService, TimerService],
})
export class CommsModule {}
