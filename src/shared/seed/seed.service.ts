import { join } from 'path';
import { EndpointService } from '~pre-built/2-endpoints/endpoint.service';
import { ProvinceService } from '~pre-built/8-provinces/province.service';
import { DistrictService } from '~pre-built/9-districts/district.service';
import { WardService } from '~pre-built/10-wards/ward.service';
import { Logger } from '~shared/logger/logger.service';
import { existsSync, readFileSync } from '~utils/file.util';

import { Injectable } from '@nestjs/common';
import { HttpMethod } from '~routes/pre-built/2-endpoints/enum/http-method';
import { MenuService } from '~routes/pre-built/3-menus/menu.service';
import { Role } from '~routes/pre-built/1-users/enums/role.enum';
import { removeTrailingSlash } from '~helpers/remove-trailing-slash';
import { EndpointGroupService } from '~routes/pre-built/2-endpoint-groups/endpoint-group.service';

@Injectable()
export class SeedService {
  constructor(
    private provinceService: ProvinceService,
    private districtService: DistrictService,
    private wardService: WardService,
    private endpointGroupService: EndpointGroupService,
    private endpointService: EndpointService,
    private menuService: MenuService,
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
    const datastring = readFileSync(jsonPath).toString().trim();

    // Convert data string to JSON
    const { data } = JSON.parse(datastring);

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
    const endpointGroupsMap = new Map<string, { prefix: string; position: number }>();
    const endpointsMap = new Map<string, { method: HttpMethod; path: string; prefix: string }>();

    routerStacks
      .filter(({ route }) => route && route.path)
      .forEach(({ route }) => {
        const endpointItem = {
          method: route.stack[0]?.method?.toUpperCase(),
          path: removeTrailingSlash(route.path),
          prefix: '#',
        };
        const prefix = endpointItem.path.split('/')[2] || '#';
        const endpointKey = `${endpointItem.method}-${endpointItem.path}`;

        endpointItem.prefix = prefix;

        if (!endpointGroupsMap.has(prefix))
          endpointGroupsMap.set(prefix, { prefix, position: endpointGroupsMap.size + 1 });

        if (!endpointsMap.has(endpointKey)) endpointsMap.set(endpointKey, endpointItem);
      });

    await this._createEndpointGroupsAndMenusFromMap(endpointGroupsMap);
    await this._createEndpointsFromMap(endpointsMap);

    this.logger.log(
      `${SeedService.name}`,
      `Total endpoints/groups: '${endpointsMap.size}/${endpointGroupsMap.size}' `,
    );

    endpointGroupsMap.clear();
    endpointsMap.clear();
  }

  private async _createEndpointsFromMap(
    endpointsMap: Map<
      string,
      {
        method: HttpMethod;
        path: string;
        prefix: string;
      }
    >,
  ) {
    endpointsMap.forEach(async (endpoint) => {
      const endpointExist = await this.endpointService.count({
        path: endpoint.path,
        method: endpoint.method,
      });

      if (!endpointExist) {
        const endpointDoc = await this.endpointService.create(endpoint);

        await this.endpointGroupService.updateOne(
          { prefix: endpointDoc.prefix },
          { $addToSet: { endpoints: endpointDoc._id } },
        );
      }
    });
  }

  private async _createEndpointGroupsAndMenusFromMap(
    endpointGroupsMap: Map<
      string,
      {
        prefix: string;
        position: number;
      }
    >,
  ) {
    endpointGroupsMap.forEach(async ({ prefix, position }) => {
      const [endpointGroupExist, menuExist] = await Promise.all([
        this.endpointGroupService.count({ prefix }),
        this.menuService.count({ prefix }),
      ]);

      const endpointGroupItem = {
        prefix,
        position,
        title: prefix,
        roles: [Role.SUPER_ADMIN],
      };

      const menuItem = {
        prefix,
        position,
        title: prefix,
        level: 1,
        url: `${prefix}`,
        isHorizontal: false,
        isShow: true,
        roles: [Role.SUPER_ADMIN],
      };

      if (!endpointGroupExist) {
        await this.endpointGroupService.create(endpointGroupItem);
      }

      if (!menuExist) {
        await this.menuService.create(menuItem);
      }
    });
  }

  private async _deleteEndpoints() {
    await Promise.all([
      this.endpointGroupService.deleteMany({}),
      this.menuService.deleteMany({}),
      this.endpointService.deleteMany({}),
    ]);
  }
}
