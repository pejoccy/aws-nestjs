import { Expose } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class EntityIdDto {
  @Expose()
  @IsInt()
  public id: number;
}

export class EntityIdOptionalDto {
  @IsOptional()
  @IsInt()
  public id?: number;
}

export class PermissionIdDto {
  @IsInt()
  public permissionId: number;
}
