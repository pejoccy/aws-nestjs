import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';
import { PaginationOptionsDto } from '../../../../common/dto';

export class GetBusinessContractorDto extends PaginationOptionsDto {
  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // searchText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBooleanString()
  status?: boolean;
}
