import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(
      'redis://:J7VXz4GIn7NLlPNrVj2uTDOPqQ9QX2kL@redis-18809.c270.us-east-1-3.ec2.cloud.redislabs.com:18809',
    );

    this.redis.on('connect', () => {
      console.log('redis connected!!!');
    });
  }

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async setWithExpiration(key: string, value: string, seconds: number): Promise<void> {
    await this.redis.set(key, value, 'EX', seconds);
  }

  async get(key: string): Promise<string> {
    return this.redis.get(key);
  }

  async delete(key: string): Promise<number> {
    return this.redis.del(key);
  }
}
