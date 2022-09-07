import { Module } from '@nestjs/common';
import { MeetModule } from './meet/meet.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ChatModule, MeetModule],
  providers: [],
  exports: []
})
export class CommsModule {}
