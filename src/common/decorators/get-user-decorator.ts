import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Account } from '../../account/account.entity';

export interface AccountAuthOptions {
  required?: boolean;
}

export const GetAccount = createParamDecorator<AccountAuthOptions>(
  (options: AccountAuthOptions, ctx: ExecutionContext): Account => {
    const req = ctx.switchToHttp().getRequest();
    if (options?.required && !req.user) {
      throw new UnauthorizedException('Authorization token missing!');
    }

    return req.user.data;
  }
);
