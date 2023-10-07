import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationOptionsDto } from '../../../common/dto/pagination-options.dto';

export class SearchFileDto extends PaginationOptionsDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  searchText: string;
}
