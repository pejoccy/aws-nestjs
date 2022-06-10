import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import config from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUtilities } from './app.utilities';
import { AuthModule } from './common/module/auth/auth.module';
import {
  NotificationController,
} from './common/module/notification/notification.controller';
import {
  NotificationModule,
} from './common/module/notification/notification.module';
import { JwtStrategy } from './common/module/auth/strategy/jwt.strategy';

@Global()
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    NotificationModule,
    PassportModule.register({}),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => config.get('db.pgsql'),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, NotificationController],
  providers: [AppService, AppUtilities, JwtStrategy],
  exports:[AppUtilities, JwtStrategy, PassportModule, AuthModule],
})
export class AppModule {}
