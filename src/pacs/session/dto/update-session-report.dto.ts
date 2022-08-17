import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSessionReportDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body: string;
}
