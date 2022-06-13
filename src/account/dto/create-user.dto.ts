import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { UserRole } from '../../common/interfaces';
import { CreateBusinessDto } from '../business/dto/create-business-dto';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsMobilePhone()
  phoneNumber: string;

  @IsEnum(UserRole)
  userType: UserRole;

  @IsNotEmpty()
  @Type(() => CreateBusinessDto)
  @ValidateIf(obj => obj.userType === UserRole.BUSINESS)
  @ValidateNested()
  business?: CreateBusinessDto;
}
