import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { ProvinceModule } from '~common/c2-provinces/province.module';
import { DistrictModule } from '~common/c3-districts/district.module';
import { WardModule } from '~common/c4-wards/ward.module';

@Module({
  imports: [ProvinceModule, DistrictModule, WardModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
