import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccountModule } from '../account/account.module';
import { BusinessModule } from '../account/business/business.module';
import { SpecialistModule } from '../account/specialist/specialist.module';
import { MailerModule } from '../common/mailer/mailer.module';
import {
  SpecializationModule,
} from '../common/specialization/specialization.module';
import { SubscriptionModule } from '../common/subscription/subscription.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  imports: [
    AccountModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => config.get('jwt'),
    }),
    MailerModule,
    BusinessModule,
    SpecialistModule,
    SpecializationModule,
    SubscriptionModule,
    AccountModule,
  ],
  exports: [AccountModule]
})
export class AuthModule {}
