import { Global, Module } from '@nestjs/common';
// import { MulterModule } from '@nestjs/platform-express';
import { MailerService } from './mailer.service';

@Global()
@Module({
  imports: [
    // MulterModule.register({}),
  ],
  controllers: [],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
