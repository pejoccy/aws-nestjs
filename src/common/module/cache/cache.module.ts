import { Module, CacheModule as Cache, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService, Cache],
  imports: [
    Cache.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        store: redisStore,
        refreshThreshold: parseInt(process.env.CACHE_TTL),
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      }),
    }),
  ],
})
export class CacheModule {}
