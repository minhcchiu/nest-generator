import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { District, DistrictSchema } from './schemas/district.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: District.name,
        useFactory: () => {
          const schema = DistrictSchema;

          // eslint-disable-next-line
          schema.plugin(require('mongoose-slug-updater'));

          return schema;
        },
      },
    ]),
  ],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: [DistrictService],
})
export class DistrictModule {}
