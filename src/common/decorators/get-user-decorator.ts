import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Account } from '../../account/account.entity';
import { AccountTypes } from '../interfaces';

export interface AccountAuthOptions {
  required?: boolean;
  accountTypes?: AccountTypes[];
}

export const GetAccount = createParamDecorator<AccountAuthOptions>(
  (options: AccountAuthOptions, ctx: ExecutionContext): Account => {
    const req = ctx.switchToHttp().getRequest();
    options = options || {};
    options.required = options?.required || true;
    options.accountTypes = options?.accountTypes || [];
    if (options.required && !req.user) {
      throw new UnauthorizedException('Authorization token missing!');
    } else if (
      options.accountTypes.length &&
      !options.accountTypes.includes(req.user?.data?.type)
    ) {
      throw new UnauthorizedException(
        `Authorized Access! Account type '${req.user?.data?.type}' not permitted.`,
      );
    }

    return req.user?.data;
  },
);
