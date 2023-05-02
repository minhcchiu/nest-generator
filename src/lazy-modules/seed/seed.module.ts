import { EndpointModule } from '~routes/endpoints/endpoint.module';

import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { DistrictModule } from '~routes/districts/district.module';
import { WardModule } from '~routes/wards/ward.module';
import { ProvinceModule } from '~routes/provinces/province.module';

@Module({
  imports: [EndpointModule, ProvinceModule, DistrictModule, WardModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
