import { Expose } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class EntityIdStringDto {
  @Expose()
  @IsUUID()
  public id: string;
}

export class EntityIdOptionalStringDto {
  @IsOptional()
  @IsUUID()
  public id?: string;
}

export class PermissionIdStringDto {
  @IsUUID()
  public permissionId: string;
}
