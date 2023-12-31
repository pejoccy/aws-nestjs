import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { FileModule } from './file/file.module';
import { PacsController } from './pacs.controller';
import { PacsService } from './pacs.service';
import { FileQueueConsumer } from './queues/consumer';
import { FILE_QUEUE } from './queues/interfaces';
import { FileQueueProducer } from './queues/producer';
import { ReportTemplateModule } from './report-template/report-template.module';
import { SessionModule } from './session/session.module';
import { S3Service } from './s3.service';
import { CommsModule } from 'src/comms/comms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file/file.entity';
import { ReportTemplate } from './report-template/report-template.entity';

@Module({
  controllers: [PacsController],
  imports: [
    TypeOrmModule.forFeature([File, ReportTemplate]),
    BullModule.registerQueue({ name: FILE_QUEUE }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.get('db.redis'),
      }),
    }),
    CommsModule,
    FileModule,
    ReportTemplateModule,
    SessionModule,
    MulterModule.register({}),
  ],
  providers: [PacsService, FileQueueConsumer, FileQueueProducer, S3Service],
  exports: [PacsService, TypeOrmModule],
})
export class PacsModule {}
