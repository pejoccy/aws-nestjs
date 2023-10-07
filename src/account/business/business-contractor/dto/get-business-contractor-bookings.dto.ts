import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsISO8601, IsInt, IsOptional } from 'class-validator';
import { PaginationOptionsDto } from '../../../../common/dto/pagination-options.dto';
import { Type } from 'class-transformer';

export class GetBusinessContractorBookingsDto extends PaginationOptionsDto {
  @ApiHideProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  contractorId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @ApiHideProperty()
  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  status?: boolean;
}
