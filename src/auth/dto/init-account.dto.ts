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
import { AccountTypes } from '../../common/interfaces';

export class InitAccountDto {
  @IsEnum(AccountTypes)
  userType: AccountTypes;

  @IsEmail()
  email: string;

  @ApiProperty()
  @IsPassword()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ValidateIf(obj => obj.userType === AccountTypes.BUSINESS)
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf(obj => obj.userType === AccountTypes.BUSINESS)
  lastName?: string;

  @IsNotEmpty()
  @IsMobilePhone()
  @ValidateIf(obj => obj.userType === AccountTypes.BUSINESS)
  mobilePhone?: string;
}
