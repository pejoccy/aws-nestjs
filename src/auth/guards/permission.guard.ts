import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { FEATURE_SLUG_KEY } from '../../common/decorators/feature-limit-check.decorator';
import { Feature } from '../../common/feature/feature.entity';
import { FeatureSlugs } from '../../common/interfaces';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<FeatureSlugs>(
      FEATURE_SLUG_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermission) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const subscription = user?.data?.subscription;

    return (
      !!subscription &&
      (!subscription.nextBillingDate ||
        new Date(subscription.nextBillingDate) >= new Date()) &&
      (subscription.plan?.permissions || []).find(
        (perm: Feature) => perm.slug === requiredPermission,
      )
    );
  }
}
