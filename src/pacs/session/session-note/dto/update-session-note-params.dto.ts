import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class UpdateSessionNoteParamsDto {
  @ApiProperty()
  @IsNumberString()
  id: number;

  @ApiProperty()
  @IsNumberString()
  noteId: number;
}
