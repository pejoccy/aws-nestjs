import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateBusinessDto } from '../business/dto/create-business-dto';
import { CreatePatientDto } from '../patient/dto/create-patient-dto';
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

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => CreateBusinessDto)
  business?: CreateBusinessDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => CreateSpecialistDto)
  specialist?: CreateSpecialistDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => CreatePatientDto)
  patient?: CreatePatientDto;
}
