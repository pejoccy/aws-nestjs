import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ROUTE_KEY = '__$isPublicRoute';
export const PublicRoute = () => SetMetadata(IS_PUBLIC_ROUTE_KEY, true);
