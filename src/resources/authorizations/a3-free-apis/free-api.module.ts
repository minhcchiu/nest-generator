import { FreeApi, FreeApiSchema } from './schemas/free-api.schema';
import { FreeApiController } from './free-api.controller';
import { FreeApiService } from './free-api.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FreeApi.name,
        schema: FreeApiSchema,
      },
    ]),
  ],
  controllers: [FreeApiController],
  providers: [FreeApiService],
  exports: [FreeApiService],
})
export class FreeApiModule {}
