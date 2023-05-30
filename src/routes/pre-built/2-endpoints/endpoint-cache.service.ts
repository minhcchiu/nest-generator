import { Injectable } from '@nestjs/common';
import { IEndpoint } from 'src/guards/app.guard';
import { RedisService } from '~shared/redis/redis.service';

@Injectable()
export class EndpointCacheService {
  constructor(private redisService: RedisService) {}

  async set(key: string, value: IEndpoint) {
    const expiresIn = 24 * 60 * 60; // 1 day

    await this.redisService.setWithExpiration(key, JSON.stringify(value), expiresIn);
  }

  async get(key: string): Promise<IEndpoint | null> {
    const endpoint = await this.redisService.get(key);

    if (endpoint) return JSON.parse(endpoint);

    return null;
  }

  async delete(key: string): Promise<number> {
    return this.redisService.delete(key);
  }
}
