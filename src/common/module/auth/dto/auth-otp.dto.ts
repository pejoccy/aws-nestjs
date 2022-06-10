import { IsNotEmpty, IsString } from 'class-validator';

export class AuthOtpDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}