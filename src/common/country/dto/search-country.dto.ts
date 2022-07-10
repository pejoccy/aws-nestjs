import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationOptionsDto } from 'src/common/dto';

export class SearchCountryDto extends PaginationOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchText: string;
}
