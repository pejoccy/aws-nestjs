import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';

export class GetPacsStatsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  contractorId?: number;
}
