import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationOptionsDto } from '../../../common/dto';

export class SearchSessionDto extends PaginationOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchText: string;
}
