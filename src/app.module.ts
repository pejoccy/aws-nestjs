import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import config from './app.config';
import { AppController } from './app.controller';
import { AppUtilities } from './app.utilities';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { PermissionGuard } from './auth/guards/permission.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { CacheModule } from './common/cache/cache.module';
import { CountryModule } from './common/country/country.module';
import {
  NotificationController,
} from './common/notification/notification.controller';
import {
  NotificationModule,
} from './common/notification/notification.module';
import { PlanModule } from './common/plan/plan.module';
import { SubscriptionModule } from './common/subscription/subscription.module';
import { PacsModule } from './pacs/pacs.module';

@Global()
@Module({
  imports: [
    AuthModule,
    AccountModule,
    CacheModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    CountryModule,
    NotificationModule,
    PacsModule,
    PassportModule.register({}),
    PlanModule,
    SubscriptionModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => config.get('db.pgsql'),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, NotificationController],
  providers: [
    AppUtilities,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    PermissionGuard,
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
