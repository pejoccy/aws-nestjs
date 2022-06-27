import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FileModality } from '../../common/interfaces';

export class UploadFolderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: FileModality })
  @IsEnum(FileModality)
  modality: FileModality;

  @ApiProperty({
    type: Array,
    format: 'binary',
    name: 'files',
  })
  @IsNotEmpty()
  files: Express.Multer.File[];
}
