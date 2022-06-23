import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

@Exclude()
export class EntityIdStringDto {
  @Expose()
  @IsUUID()
  public id: string;
}

@Exclude()
export class EntityIdOptionalStringDto {
  @Expose()
  @IsOptional()
  @IsUUID()
  public id?: string;
}

@Exclude()
export class PermissionIdStringDto {
  @Expose()
  @IsUUID()
  public permissionId: string;
}
