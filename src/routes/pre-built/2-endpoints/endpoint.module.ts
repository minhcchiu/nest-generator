import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EndpointController } from './endpoint.controller';
import { Endpoint, EndpointSchema } from './endpoint.schema';
import { EndpointService } from './endpoint.service';

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
  providers: [EndpointService],
  exports: [EndpointService],
})
export class EndpointModule {}
