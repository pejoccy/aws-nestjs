import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetActivity } from './meet-activity.entity';


@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([MeetActivity])],
  providers: [],
  exports: [TypeOrmModule],
})
export class MeetActivityModule {}
