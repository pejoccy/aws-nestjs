import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FileModality } from '../../common/interfaces';

export class UploadFolderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'This is the patient ID of an existing patient obtained from the API GET /api/v1/patients OR a new patient created by calling the POST /api/v1/patients.'
  })
  @IsInt()
  @IsOptional()
  patientId?: number;

  @ApiProperty({ enum: FileModality })
  @IsEnum(FileModality)
  modality: FileModality;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  modalitySection?: string;

  @ApiProperty({
    type: Array,
    format: 'binary',
    name: 'files',
  })
  @IsNotEmpty()
  files: Express.Multer.File[];
}
