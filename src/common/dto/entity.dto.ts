import { Expose } from 'class-transformer';
import { IsNumberString, IsOptional } from 'class-validator';

export class EntityIdDto {
  @Expose()
  @IsNumberString()
  public id: number;
}

export class EntityIdOptionalDto {
  @IsOptional()
  @IsNumberString()
  public id?: number;
}

export class PermissionIdDto {
  @IsNumberString()
  public permissionId: number;
}
