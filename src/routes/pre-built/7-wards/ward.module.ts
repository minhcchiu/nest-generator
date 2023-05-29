import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WardController } from './ward.controller';
import { Ward, WardSchema } from './ward.schema';
import { WardService } from './ward.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Ward.name,
        useFactory: () => {
          const schema = WardSchema;

          // eslint-disable-next-line
          schema.plugin(require('mongoose-slug-updater'));

          return schema;
        },
      },
    ]),
  ],
  controllers: [WardController],
  providers: [WardService],
  exports: [WardService],
})
export class WardModule {}
