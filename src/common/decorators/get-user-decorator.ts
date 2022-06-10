import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../modules/user/user.entity';

export interface UserAuthOptions {
  required?: boolean;
}

export const GetUser = createParamDecorator<UserAuthOptions>(
  (options: UserAuthOptions, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    if (options?.required && !req.user) {
      throw new UnauthorizedException('Authorization token missing!');
    }

    return req.user;
  }
);
