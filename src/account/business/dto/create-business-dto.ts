import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBase64,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { BusinessCategories } from '../../../common/interfaces';

export class CreateBusinessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsMobilePhone()
  mobilePhone: string;

  @ApiProperty({ enum: BusinessCategories })
  @IsEnum(BusinessCategories)
  category: BusinessCategories;
  
  @ApiProperty()
  @IsNumber()
  countryId: number;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactAddress: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBase64()
  logo?: string;
}
