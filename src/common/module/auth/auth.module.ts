import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from '../business/business.entity';
import { CacheModule } from '../cache/cache.module';
import { MailerModule } from '../mailer/mailer.module';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  imports: [
    CacheModule,
    UserModule,
    MailerModule,
    TypeOrmModule.forFeature([User, Business])
  ],
  exports: [TypeOrmModule, UserModule]
})
export class AuthModule {}
