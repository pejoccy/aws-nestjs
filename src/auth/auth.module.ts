import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CommsModule } from 'src/comms/comms.module';
import { AccountModule } from '../account/account.module';
import { BusinessModule } from '../account/business/business.module';
import { PatientModule } from '../account/patient/patient.module';
import { SpecialistModule } from '../account/specialist/specialist.module';
import { MailerModule } from '../common/mailer/mailer.module';
import { SpecializationModule } from '../common/specialization/specialization.module';
import { SubscriptionModule } from '../common/subscription/subscription.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  imports: [
    AccountModule,
    BusinessModule,
    CommsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => config.get('jwt'),
    }),
    MailerModule,
    PatientModule,
    SpecialistModule,
    SpecializationModule,
    SubscriptionModule,
  ],
  exports: [AccountModule, AuthService, JwtService],
})
export class AuthModule {}
