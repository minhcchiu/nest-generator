import { ApiCollection, ApiCollectionSchema } from './schemas/api-collection.schema';
import { ApiCollectionController } from './api-collection.controller';
import { ApiCollectionService } from './api-collection.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ApiCollection.name,
        schema: ApiCollectionSchema,
      },
    ]),
  ],
  controllers: [ApiCollectionController],
  providers: [ApiCollectionService],
  exports: [ApiCollectionService],
})
export class ApiCollectionModule {}
