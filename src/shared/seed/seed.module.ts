import { EndpointModule } from '~pre-built/2-endpoints/endpoint.module';
import { WardModule } from '~pre-built/7-wards/ward.module';
import { DistrictModule } from '~pre-built/8-districts/district.module';
import { ProvinceModule } from '~pre-built/9-provinces/province.module';

import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [EndpointModule, ProvinceModule, DistrictModule, WardModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
