import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EndpointController } from './endpoint.controller';
import { EndpointService } from './endpoint.service';
import { Endpoint, EndpointSchema } from './schemas/endpoint.schema';

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
