import { ApiHideProperty } from '@nestjs/swagger';
import { IsEmail, IsIP, IsOptional } from 'class-validator';
import { IsPassword } from '../../common/decorators/is-password';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsPassword()
  password: string;

  @ApiHideProperty()
  @IsIP()
  @IsOptional()
  ipAddress?: string;
}