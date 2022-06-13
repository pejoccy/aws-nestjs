import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/account.entity';
import { AccountModule } from '../account/account.module';
import { Business } from '../account/business/business.entity';
import { MailerModule } from '../common/mailer/mailer.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => config.get('jwt'),
    }),
    MailerModule,
    TypeOrmModule.forFeature([Account, Business]),
    AccountModule,
  ],
  exports: [TypeOrmModule, AccountModule]
})
export class AuthModule {}
