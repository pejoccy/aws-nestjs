import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../interfaces';

export const ROLES_KEY = '__$roles';

export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
