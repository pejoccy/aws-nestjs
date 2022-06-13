import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QUEUE } from './constants';
import { SmsProviderFactory } from './providers';
import { DotGoSMSProvider } from './providers/dotGo';
import { HollaTagsSMSProvider } from './providers/hollaTags';
import { SmsQueueConsumer } from './queue/consumer';
import { SmsQueueProducer } from './queue/producer';
import { SmsService } from './sms.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUE }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.get('db.redis'),
      }),
    }),
  ],
  controllers: [],
  providers: [
    DotGoSMSProvider,
    HollaTagsSMSProvider,
    SmsProviderFactory,
    SmsQueueConsumer,
    SmsQueueProducer,
    SmsService,
  ],
})
export class SmsModule {}
