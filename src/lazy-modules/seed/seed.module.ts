import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { ProvinceModule } from '~common/c6-provinces/province.module';
import { DistrictModule } from '~common/c7-districts/district.module';
import { WardModule } from '~common/c8-wards/ward.module';

@Module({
  imports: [ProvinceModule, DistrictModule, WardModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
