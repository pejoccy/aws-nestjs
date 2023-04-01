import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptionsDto } from '../../../common/dto';
import { FileModality, ShareOptions } from '../../../common/interfaces';

export class SearchSessionDto extends PaginationOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBooleanString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ShareOptions)
  sessionPrivacy?: ShareOptions;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(FileModality)
  modality?: FileModality;

  @ApiPropertyOptional()
  @IsISO8601()
  @IsOptional()
  receivingDate?: string;
}
