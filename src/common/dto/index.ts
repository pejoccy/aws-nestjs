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
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  public page = 1;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  public limit = 10;
}

export class PaginationCursorOptionsDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  public nextToken?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  public sortOrder: 'ASCENDING' | 'DESCENDING' = 'DESCENDING';

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  public notAfter?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  public notBefore?: Date;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  public limit = 25;
}
