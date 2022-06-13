import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from '../business/business.entity';
import { MailerModule } from '../mailer/mailer.module';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        console.log('*******', config.get('jwt'))
        return config.get('jwt');
      },
    }),
    MailerModule,
    TypeOrmModule.forFeature([User, Business]),
    UserModule,
  ],
  exports: [TypeOrmModule, UserModule]
})
export class AuthModule {}
