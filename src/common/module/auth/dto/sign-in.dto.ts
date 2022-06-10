import { IsEmail, IsIP } from 'class-validator';
import { IsPassword } from '../../../decorators/is-password';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsPassword()
  password: string;

  @IsIP()
  ipAddress: string;
}