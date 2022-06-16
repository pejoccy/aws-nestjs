import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { IsPassword } from '../../common/decorators/is-password';
import { UserRole } from '../../common/interfaces';

export class InitAccountDto {
  @IsEnum(UserRole)
  userType: UserRole;

  @IsEmail()
  email: string;

  @ApiProperty()
  @IsPassword()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ValidateIf(obj => obj.userType === UserRole.BUSINESS)
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf(obj => obj.userType === UserRole.BUSINESS)
  lastName?: string;

  @IsNotEmpty()
  @IsMobilePhone()
  @ValidateIf(obj => obj.userType === UserRole.BUSINESS)
  phoneNumber?: string;
}
