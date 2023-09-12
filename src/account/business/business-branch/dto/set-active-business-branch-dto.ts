import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class SetActiveBusinessBranchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  branchId?: number;
}
