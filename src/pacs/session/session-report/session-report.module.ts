import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from '../../../account/specialist/specialist.entity';
import { SessionReport } from './session-report.entity';
import { SessionReportService } from './session-report.service';

@Module({
  providers: [SessionReportService],
  controllers: [],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([SessionReport, Specialist])],
})
export class SessionReportModule {}
