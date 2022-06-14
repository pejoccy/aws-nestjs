import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase64,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMobilePhone()
  phoneNumber: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactAddress: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBase64()
  logo?: string;
}
