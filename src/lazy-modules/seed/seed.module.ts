import { Module } from '@nestjs/common';
import { ProvinceModule } from '~common/c3-provinces/province.module';
import { DistrictModule } from '~common/c4-districts/district.module';
import { WardModule } from '~common/c5-wards/ward.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [ProvinceModule, DistrictModule, WardModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
