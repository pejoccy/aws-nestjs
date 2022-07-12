import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBase64,
  IsEmail,
  IsInt,
  IsISO8601,
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
  @IsISO8601()
  public dateOfBirth: string;

  @ApiProperty()
  @IsMobilePhone()
  public mobilePhone: string;

  @ApiProperty()
  @IsInt()
  public countryId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  public accountId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBase64()
  profilePhoto?: string;
}
