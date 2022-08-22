import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ProvinceSeeder from 'src/lazy-modules/seed/province.seeder';
import { DistrictModule } from '~common/c4-districts/district.module';
import { District, DistrictSchema } from '~common/c4-districts/schemas/district.schema';
import { Ward, WardSchema } from '~common/c5-wards/schemas/ward.schema';
import { WardModule } from '~common/c5-wards/ward.module';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';
import { Province, ProvinceSchema } from './schemas/province.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Province.name,
        useFactory: () => {
          const schema = ProvinceSchema;

          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-slug-updater'));

          return schema;
        },
      },
    ]),
    DistrictModule,
    WardModule
  ],
  controllers: [ProvinceController],
  providers: [ProvinceService, ProvinceSeeder],
  exports: [ProvinceService],
})
export class ProvinceModule { }
