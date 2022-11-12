import { ApiResource, ApiResourceSchema } from './schemas/api-resource.schema';
import { ApiResourceController } from './api-resource.controller';
import { ApiResourceService } from './api-resource.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ApiResource.name,
        schema: ApiResourceSchema,
      },
    ]),
  ],
  controllers: [ApiResourceController],
  providers: [ApiResourceService],
  exports: [ApiResourceService],
})
export class ApiResourceModule {}
