import { SetMetadata } from '@nestjs/common';
import { AccountTypes } from '../interfaces';

export const ROLES_KEY = '__$roles';

export const Roles = (...roles: AccountTypes[]) =>
  SetMetadata(ROLES_KEY, roles);
