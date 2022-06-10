import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../interfaces';

export const ROLES_KEY = '__$roles';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
