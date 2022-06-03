import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NotificationController } from './notification/notification.controller';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [AuthModule, UserModule, NotificationModule],
  controllers: [AppController, NotificationController],
  providers: [AppService],
})
export class AppModule {}
