import { SetMetadata } from '@nestjs/common';
import { ResourcePermissions } from '../interfaces';

export const PERMISSION_KEY = '__$permission';

export const ResourcePermission = (permission: ResourcePermissions) => SetMetadata(PERMISSION_KEY, permission);
