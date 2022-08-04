import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSessionNoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body: string;
}
