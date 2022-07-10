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

export class ICreateAccount {
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
  specialist?: Omit<CreateSpecialistDto, 'email'>;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => CreatePatientDto)
  patient?: Omit<CreatePatientDto, 'email'>;
}
