import { Module } from '@nestjs/common';
import { ChimeCommsProvider } from '../providers/chime';
import { MeetService } from './meet.service';

@Module({
  imports: [],
  providers: [MeetService, ChimeCommsProvider],
  controllers: [],
  exports: [MeetService],
})
export class MeetModule {}