import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Account } from '../../account/account.entity';

export interface UserAuthOptions {
  required?: boolean;
}

export const GetUser = createParamDecorator<UserAuthOptions>(
  (options: UserAuthOptions, ctx: ExecutionContext): Account => {
    const req = ctx.switchToHttp().getRequest();
    if (options?.required && !req.user) {
      throw new UnauthorizedException('Authorization token missing!');
    }

    return req.user;
  }
);
