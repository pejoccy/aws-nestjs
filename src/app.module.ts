import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import config from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUtilities } from './app.utilities';
import { AuthModule } from './common/modules/auth/auth.module';
import { JwtStrategy } from './common/modules/auth/strategy/jwt.strategy';
import { CacheModule } from './common/modules/cache/cache.module';
import {
  NotificationController,
} from './common/modules/notification/notification.controller';
import {
  NotificationModule,
} from './common/modules/notification/notification.module';

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
  providers: [AppService, AppUtilities, JwtStrategy],
  exports:[
    AppUtilities,
    AuthModule,
    CacheModule,
    JwtStrategy,
    PassportModule,
  ],
})
export class AppModule {}
