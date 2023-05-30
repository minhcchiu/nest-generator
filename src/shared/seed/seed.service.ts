import { join } from 'path';
import { EndpointService } from '~pre-built/2-endpoints/endpoint.service';
import { ProvinceService } from '~pre-built/8-provinces/province.service';
import { DistrictService } from '~pre-built/9-districts/district.service';
import { WardService } from '~pre-built/10-wards/ward.service';
import { Logger } from '~shared/logger/logger.service';
import { existsSync, readFileSync } from '~utils/file.util';

import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  constructor(
    private provinceService: ProvinceService,
    private districtService: DistrictService,
    private wardService: WardService,
    private endpointService: EndpointService,
    private logger: Logger,
  ) {}

  async seedProvincesDistrictsWards() {
    const jsonPath = join(__dirname, '../../utils/json/provinces-districts-wards.json');
    const isFileExist = existsSync(jsonPath);
    const counter = {
      totalProvince: 0,
      totalDistrict: 0,
      totalWard: 0,
    };

    //  check file exist
    if (!isFileExist)
      this.logger.error(SeedService.name, `${jsonPath} was not found, cannot seed provinces`);

    //  Read data file
    const dataString = readFileSync(jsonPath).toString().trim();

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

        // Save wards
        await Promise.all(wardSavedPromises);
      }
    }

    this.logger.log('Seed data for all provinces, districts, wards successfully!', {
      ...counter,
    });

    return { ...counter };
  }

  async seedEndpoints(routerStacks: any[]) {
    const endpoints = routerStacks
      .filter(({ route }) => route && route.path)
      .map(({ route }) => ({
        method: route.stack[0]?.method?.toUpperCase(),
        path: route.path,
      }))
      .reduce((uniqueEndpoints, endpoint) => {
        if (
          !uniqueEndpoints.some((e) => e.method === endpoint.method && e.path === endpoint.path)
        ) {
          uniqueEndpoints.push(endpoint);
        }
        return uniqueEndpoints;
      }, []);

    const results = await Promise.all(
      endpoints.map((endpoint) =>
        this.endpointService.updateOne(endpoint, endpoint, { upsert: true }),
      ),
    );

    this.logger.log(
      `${SeedService.name}`,
      `Successfully seeded ${results.length} unique endpoints to the database.`,
    );
  }
}
