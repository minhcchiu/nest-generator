import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EndpointGroupController } from './endpoint-group.controller';
import { EndpointGroupService } from './endpoint-group.service';
import { EndpointGroup, EndpointGroupSchema } from './schemas/endpoint-group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EndpointGroup.name,
        schema: EndpointGroupSchema,
      },
    ]),
  ],
  controllers: [EndpointGroupController],
  providers: [EndpointGroupService],
  exports: [EndpointGroupService],
})
export class EndpointGroupModule {}
