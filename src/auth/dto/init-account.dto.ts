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
import { UserRoles } from '../../common/interfaces';

export class InitAccountDto {
  @IsEnum(UserRoles)
  userType: UserRoles;

  @IsEmail()
  email: string;

  @ApiProperty()
  @IsPassword()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ValidateIf(obj => obj.userType === UserRoles.BUSINESS)
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf(obj => obj.userType === UserRoles.BUSINESS)
  lastName?: string;

  @IsNotEmpty()
  @IsMobilePhone()
  @ValidateIf(obj => obj.userType === UserRoles.BUSINESS)
  phoneNumber?: string;
}
