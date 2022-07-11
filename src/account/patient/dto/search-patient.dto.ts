import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationOptionsDto } from '../../../common/dto';

export class SearchPatientDto extends PaginationOptionsDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  searchText: string;
}
