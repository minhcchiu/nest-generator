import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DistrictController } from './district.controller';
import { District, DistrictSchema } from './district.schema';
import { DistrictService } from './district.service';

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
