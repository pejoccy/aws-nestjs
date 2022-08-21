import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportTemplate } from './report-template.entity';
import { ReportTemplateService } from './report-template.service';

@Module({
  providers: [ReportTemplateService],
  controllers: [],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([ReportTemplate])],
})
export class ReportTemplateModule {}
