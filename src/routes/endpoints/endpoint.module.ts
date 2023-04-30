import { Endpoint, EndpointSchema } from './endpoint.schema';
import { EndpointController } from './endpoint.controller';
import { EndpointService } from './endpoint.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

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
