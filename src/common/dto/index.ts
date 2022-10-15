import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class PaginationOptionsDto {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  public page = 1;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  public limit = 10;
}

export class PaginationCursorOptionsDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  public nextToken?: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  public sortOrder: 'ASCENDING' | 'DESCENDING' = 'DESCENDING';

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  public notAfter?: Date;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  public notBefore?: Date;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  public limit = 25;
}
