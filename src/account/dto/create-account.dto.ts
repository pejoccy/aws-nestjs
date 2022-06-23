import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateBusinessDto } from '../business/dto/create-business-dto';
import { CreateSpecialistDto } from '../specialist/dto/create-specialist-dto';

export class CreateAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsMobilePhone()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => CreateBusinessDto)
  business?: CreateBusinessDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => CreateSpecialistDto)
  specialist?: CreateSpecialistDto;
}
