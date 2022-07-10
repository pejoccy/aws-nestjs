import { Exclude, Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

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