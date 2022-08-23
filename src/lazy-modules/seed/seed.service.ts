import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { ProvinceService } from '~common/c3-provinces/province.service';
import { DistrictService } from '~common/c4-districts/district.service';
import { WardService } from '~common/c5-wards/ward.service';
import { FileHelper } from '~helper/file.helper';

@Injectable()
export class SeedService {
  constructor(
    private provinceService: ProvinceService,
    private districtService: DistrictService,
    private wardService: WardService,
  ) {}

  /**
   * Delete all provinces districs wards
   * @returns
   */
  async deleteAllProvincesDistrictWard() {
    const [provinces, districts, wards] = await Promise.all([
      this.provinceService.deleteMany({}),
      this.districtService.deleteMany({}),
      this.wardService.deleteMany(),
    ]);

    return { provinces, districts, wards };
  }

  /**
   * Seed data for provinces, district, ward
   * @returns
   */
  async seedProvincesDistrictWard() {
    const jsonPath = path.join(__dirname, '../../utils/json/dvhcvn.json');

    const isFileExist = FileHelper.isFileExist(jsonPath);

    if (!isFileExist)
      console.error(`${jsonPath} was not found, cannot seed province`);

    const dataString = FileHelper.readFileSync(jsonPath).toString();

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

    return { ...counter };
  }
}
