import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase64,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateSpecialistDto } from './create-specialist-dto';

export class SetupSpecialistDto extends CreateSpecialistDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMobilePhone()
  phoneNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBase64()
  profilePhoto?: string;
}
