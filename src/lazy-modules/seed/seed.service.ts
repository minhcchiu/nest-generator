import { join } from 'path';
import { Injectable } from '@nestjs/common';

import { ProvinceService } from '~common/c2-provinces/province.service';
import { DistrictService } from '~common/c3-districts/district.service';
import { WardService } from '~common/c4-wards/ward.service';
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
   * Delete all provinces districs wards
   *
   * @returns
   */
  async deleteAllProvincesDistrictWard() {
    const [provinces, districts, wards] = await Promise.all([
      this.provinceService.deleteMany({}),
      this.districtService.deleteMany({}),
      this.wardService.deleteMany(),
    ]);

    this.logger.log('Delete all provinces, district, wards successfully!', {
      provinces,
      districts,
      wards,
    });

    return { provinces, districts, wards };
  }

  /**
   * Seed data for provinces, district, ward
   *
   * @returns
   */
  async seedProvincesDistrictWard() {
    const jsonPath = join(__dirname, '../../utils/json/dvhcvn.json');

    const isFileExist = fileHelper.isFileExist(jsonPath);

    if (!isFileExist)
      this.logger.error(
        SeedService.name,
        `${jsonPath} was not found, cannot seed province`,
      );

    const dataString = fileHelper.readFileSync(jsonPath).toString();

    const { data } = JSON.parse(dataString);

    const counter = {
      totalProvince: 0,
      totalDistrict: 0,
      totalWard: 0,
    };
    const resultPromise = data.map(async (province: any) => {
      counter.totalProvince++;

      // province item
      const provinceItem = {
        name: province.name,
        type: province.type,
      };

      // create promise
      const provincePromise = this.provinceService.create(provinceItem);

      // get districtList from data
      const districtList = province.level2s;

      return provincePromise.then((rsProvince) => {
        const idProvince = rsProvince._id;

        return districtList.map(async (district: any) => {
          counter.totalDistrict++;

          // district item
          const districtItem = {
            name: district.name,
            type: district.type,
            idProvince: idProvince,
          };

          // create district
          const districtPromise = this.districtService.create(districtItem);

          // get wardList from data
          const wardList = district.level3s;

          return districtPromise.then((rsDistrict) => {
            return wardList.map((ward: any) => {
              counter.totalWard++;

              // ward item
              const wardItem = {
                name: ward.name,
                type: ward.type,
                idProvince: idProvince,
                idDistrict: rsDistrict._id,
              };

              // create ward
              const wardPromise = this.wardService.create(wardItem);

              return wardPromise;
            });
          });
        });
      });
    });

    await Promise.all(resultPromise);

    this.logger.log(
      'Seed data for all provinces, district, wards successfully!',
      {
        ...counter,
      },
    );

    return { ...counter };
  }
}
