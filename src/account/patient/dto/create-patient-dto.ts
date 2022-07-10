import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBase64,
  IsEmail,
  IsInt,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePatientDto {
  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsMobilePhone()
  public mobilePhone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  public accountId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBase64()
  profilePhoto?: string;
}
