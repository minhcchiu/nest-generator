import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EndpointController } from './endpoint.controller';
import { Endpoint, EndpointSchema } from './schemas/endpoint.schema';
import { EndpointService } from './endpoint.service';
import { EndpointCacheService } from './endpoint-cache.service';
import { RedisService } from '~shared/redis/redis.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Endpoint.name,
        schema: EndpointSchema,
      },
    ]),
  ],
  controllers: [EndpointController],
  providers: [RedisService, EndpointService, EndpointCacheService],
  exports: [EndpointService, EndpointCacheService],
})
export class EndpointModule {}
