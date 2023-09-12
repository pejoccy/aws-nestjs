import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBase64,
  IsEmail,
  IsEnum,
  IsInt,
  IsISO8601,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from 'src/common/interfaces';

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

  @ApiProperty({
    description: "This is the patient's date of birth.",
    example: '2001-10-31',
  })
  @IsISO8601()
  public dateOfBirth: string;

  @ApiProperty()
  @IsMobilePhone()
  public mobilePhone: string;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  public gender: Gender;

  @ApiProperty({
    description: 'This is the country id from GET /api/v1/countries',
  })
  @IsInt()
  public countryId: number;

  @ApiPropertyOptional({
    description: 'This is the country id from GET /api/v1/countries',
  })
  @IsInt()
  @IsOptional()
  public stateId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  public accountId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBase64()
  profilePhoto?: string;
}
