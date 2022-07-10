import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { SpecialistCategories } from '../../../common/interfaces';

export class CreateSpecialistDto {
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
  @IsNotEmpty()
  @IsMobilePhone()
  mobilePhone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBase64()
  profilePhoto?: string;

  @ApiProperty({ enum: SpecialistCategories })
  @IsEnum(SpecialistCategories)
  public category: SpecialistCategories;

  @ApiProperty()
  @IsInt()
  public specializationId: number;

  @ApiHideProperty()
  @IsInt()
  @IsOptional()
  public accountId?: number;
}
