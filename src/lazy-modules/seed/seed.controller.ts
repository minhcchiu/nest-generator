import { Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seeds')
export class SeedController {
  constructor(private seedService: SeedService) {}

  /**
   * Seed data for provinces, district, ward
   * @returns
   */
  @Post('provinces-districts-wards')
  @HttpCode(200)
  async seedProvincesDistrictWard() {
    return this.seedService.seedProvincesDistrictWard();
  }

  /**
   * Seed data for provinces, district, ward
   * @returns
   */
  @Delete('provinces-districts-wards')
  @HttpCode(200)
  async deleteAllProvincesDistrictWard() {
    return this.seedService.deleteAllProvincesDistrictWard();
  }
}
