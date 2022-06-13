import { IsNotEmpty, IsString } from 'class-validator';
import { IsPassword } from '../../common/decorators/is-password';

export class ResetPasswordDto {
  @IsPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}
