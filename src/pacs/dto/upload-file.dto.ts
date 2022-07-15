import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileModality } from '../../common/interfaces';

export class UploadFileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: FileModality })
  @IsEnum(FileModality)
  modality: FileModality;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  modalitySection?: string;

  @ApiPropertyOptional({
    description: 'This is the patient ID of an existing patient obtained from the API GET /api/v1/patients OR a new patient created by calling the POST /api/v1/patients.'
  })
  @IsInt()
  @IsOptional()
  patientId?: number;

  @ApiProperty({
    type: String,
    format: 'binary',
    name: 'file',
  })
  // @IsNotEmpty()
  file: Express.Multer.File;
}
