import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddSessionReportDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  findings: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  clinical_information?: string;
}
