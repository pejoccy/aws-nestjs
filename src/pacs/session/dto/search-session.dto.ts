import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { PaginationOptionsDto } from '../../../common/dto';
import {
  FileModality,
  SessionStatus,
  ShareOptions,
} from '../../../common/interfaces';

export class SearchSessionDto extends PaginationOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchText?: string;

  @ApiPropertyOptional({ enum: SessionStatus })
  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @ApiPropertyOptional({ enum: ShareOptions })
  @IsOptional()
  @IsEnum(ShareOptions)
  sessionPrivacy?: ShareOptions;

  @ApiPropertyOptional({ enum: FileModality })
  @IsOptional()
  @IsEnum(FileModality)
  modality?: FileModality;

  @ApiPropertyOptional()
  @IsISO8601()
  @IsOptional()
  receivingDate?: string;
}
