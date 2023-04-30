import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { ProvinceService } from 'src/routes/c6-provinces/province.service';
import { DistrictService } from 'src/routes/c7-districts/district.service';
import { WardService } from 'src/routes/c8-wards/ward.service';
import { fileHelper } from '~helper/file.helper';
import { Logger } from '~lazy-modules/logger/logger.service';

@Injectable()
export class SeedService {
  constructor(
    private provinceService: ProvinceService,
    private districtService: DistrictService,
    private wardService: WardService,
    private logger: Logger,
  ) {}

  /**
   * Seed data for provinces, district, ward
   *
   * @returns
   */
  async seedProvincesDistrictsWards() {
    const jsonPath = join(__dirname, '../../utils/json/provinces-districts-wards.json');
    const isFileExist = fileHelper.isFileExist(jsonPath);
    const counter = {
      totalProvince: 0,
      totalDistrict: 0,
      totalWard: 0,
    };

    //  check file exist
    if (!isFileExist)
      this.logger.error(SeedService.name, `${jsonPath} was not found, cannot seed provinces`);

    //  Read data file
    const dataString = fileHelper.readFileSync(jsonPath).toString().trim();

    // Convert data string to JSON
    const { data } = JSON.parse(dataString);

    // Delete all provinces,district, wards
    await Promise.all([
      this.provinceService.deleteMany({}),
      this.districtService.deleteMany({}),
      this.wardService.deleteMany({}),
    ]);

    // Loop data
    for await (const province of data) {
      const provinceItem = {
        name: province.name,
        type: province.type,
      };

      // Save province
      const provinceSaved = await this.provinceService.create(provinceItem);
      counter.totalProvince++;

      // Get idProvince
      const idProvince = provinceSaved._id;

      // Loop level2s
      for await (const district of province.districts) {
        const districtItem = {
          idProvince,
          name: district.name,
          type: district.type,
        };

        // Save district
        const districtSaved = await this.districtService.create(districtItem);
        counter.totalDistrict++;

        // Get idDistrict
        const idDistrict = districtSaved._id;

        // Store wards of districts
        const wardSavedPromises = district.wards.map((ward: any) => {
          const wardItem = {
            idProvince,
            idDistrict,
            name: ward.name,
            type: ward.type,
          };

          counter.totalWard++;
          return this.wardService.create(wardItem);
        });

        console.log({ counter });

        // Save wards
        await Promise.all(wardSavedPromises);
      }
    }

    console.log({ counter });

    this.logger.log('Seed data for all provinces, districts, wards successfully!', {
      ...counter,
    });

    return { ...counter };
  }
}
