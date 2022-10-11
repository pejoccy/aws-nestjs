import { Module, CacheModule as Cache } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from './cache.service';

@Module({
  providers: [CacheService],
  exports: [CacheService, Cache],
  imports: [
    Cache.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: redisStore,
        ...config.get('db.redis'),
      }),
    }),
  ],
})
export class CacheModule {}
