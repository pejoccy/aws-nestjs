import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FileModality } from '../../common/interfaces';

export class UploadFileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: FileModality })
  @IsEnum(FileModality)
  modality: FileModality;

  @ApiProperty({
    type: String,
    format: 'binary',
    name: 'file',
  })
  // @IsNotEmpty()
  file: Express.Multer.File;
}
