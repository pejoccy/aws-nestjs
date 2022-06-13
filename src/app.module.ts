import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import config from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUtilities } from './app.utilities';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { CacheModule } from './common/cache/cache.module';
import {
  NotificationController,
} from './common/notification/notification.controller';
import {
  NotificationModule,
} from './common/notification/notification.module';

@Global()
@Module({
  imports: [
    AuthModule,
    CacheModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    NotificationModule,
    PassportModule.register({}),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => config.get('db.pgsql'),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, NotificationController],
  providers: [
    AppService,
    AppUtilities,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    JwtStrategy,
  ],
  exports:[
    AppUtilities,
    AuthModule,
    CacheModule,
    JwtStrategy,
    PassportModule,
  ],
})
export class AppModule {}
