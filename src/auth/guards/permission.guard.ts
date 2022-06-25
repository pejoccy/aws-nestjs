import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Permission } from 'src/common/permission/permission.entity';
import { PERMISSION_KEY } from '../../common/decorators/permission.decorator';
import { ResourcePermissions } from '../../common/interfaces';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<ResourcePermissions>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredPermission) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const subscription = user?.data?.subscription;

    return !!subscription &&
      (!subscription.nextBillingDate ||
        new Date(subscription.nextBillingDate) >= new Date()) &&
      (subscription.plan?.permissions || []).find(
        (perm: Permission) => (perm.slug === requiredPermission)
      );
  }
}
