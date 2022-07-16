import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
