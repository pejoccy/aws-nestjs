import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Account } from '../../account/account.entity';
import { AccountTypes, BusinessContractorRoles } from '../interfaces';

export interface AccountAuthOptions {
  required?: boolean;
  accountTypes?: AccountTypes[];
  roles?: BusinessContractorRoles[];
}

export const GetAccount = createParamDecorator<AccountAuthOptions>(
  (options: AccountAuthOptions, ctx: ExecutionContext): Account => {
    const req = ctx.switchToHttp().getRequest();
    options = options || {};
    options.required = options?.required || true;
    options.accountTypes = options?.accountTypes || [];
    options.roles = options?.roles || [];

    if (options.required && !req.user) {
      throw new UnauthorizedException('Authorization token missing!');
    } else if (
      (!options.accountTypes.length && !options.roles.length) ||
      options.accountTypes.includes(req.user?.data?.type) ||
      (options.roles.includes(
        req.user?.data?.specialist?.contractors[0]?.role,
      ) &&
        req.user?.data?.specialist?.contractors[0]?.status)
    ) {
      return req.user?.data;
    }

    throw new UnauthorizedException(
      `Access Denied! Account Type/Role is Unauthorized.`,
    );
  },
);
