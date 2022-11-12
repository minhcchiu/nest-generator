import { ApiTags } from '@nestjs/swagger';
import { Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@ApiTags('seeder')
@Controller('seeds')
export class SeedController {
  constructor(private seedService: SeedService) {}

  /**
   * Seed data for provinces, district, ward
   *
   * @returns
   */
  @Post('provinces_districts_wards')
  @HttpCode(200)
  async seedProvincesDistrictsWards() {
    return this.seedService.seedProvincesDistrictsWards();
  }
}
