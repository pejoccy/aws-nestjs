import { ApiHideProperty } from '@nestjs/swagger';
import { IsEmail, IsIP, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiHideProperty()
  @IsIP()
  @IsOptional()
  ipAddress?: string;
}