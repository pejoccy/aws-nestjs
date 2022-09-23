import { SetMetadata } from '@nestjs/common';
import { FeatureSlugs } from '../interfaces';

export const FEATURE_SLUG_KEY = '__$feature_slug';

export const FeatureLimitCheck = (feature: FeatureSlugs) => SetMetadata(FEATURE_SLUG_KEY, feature);
