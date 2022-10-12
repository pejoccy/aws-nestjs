import { Injectable } from '@nestjs/common';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class TimerService {
  constructor(private cacheService: CacheService) {}

  async start(sessionId: string): Promise<any> {
    const timer = await this.cacheService.get(sessionId);
    if (timer) {
    }
    // store sessionId in the cache, ttl -> meeting duration

    // Setup 2 jobs
    // 1. create a job that sends meeting termination in x minutes before the end of the meeting
    // 2. create a job that gets triggered when the meeting should end
  }

  async end(sessionId: string): Promise<any> {
    const timer = await this.cacheService.get(sessionId);
    if (!timer) {
      return;
    }
    // 1. get jobs (timer executors) -> jobMetaData
    // -> a. run job to terminate meeting cache token
    // -> b. delete job to reminder meeting closing
    // 2. remove cache token
  }
}
