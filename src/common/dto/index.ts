import { Exclude, Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

@Exclude()
export class PaginationOptionsDto {
  @Expose()
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  public page = 1;

  @Expose()
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  public limit = 10;
}