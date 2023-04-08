import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBase64,
  IsEmail,
  IsEnum,
  IsInt,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from '../../../common/interfaces';

export class CreateBusinessContactDto {
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

  @ApiPropertyOptional({ enum: Gender })
  @IsEnum(Gender)
  @IsOptional()
  public gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBase64()
  profilePhoto?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactAddress?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  businessId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  accountId?: number;
}
