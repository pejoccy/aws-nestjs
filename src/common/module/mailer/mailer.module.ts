import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { MulterModule } from '@nestjs/platform-express';
import { MailerService } from './mailer.service';

@Global()
@Module({
  imports: [
    NestMailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => config.get('smtp'),
    }),
    // MulterModule.register({}),
  ],
  controllers: [],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
