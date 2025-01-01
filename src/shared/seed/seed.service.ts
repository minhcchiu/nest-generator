import { Injectable } from "@nestjs/common";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { removeTrailingSlash } from "~helpers/remove-trailing-slash";
import { WardService } from "~pre-built/10-wards/ward.service";

import { EnvStatic } from "src/configurations/static.env";
import { CreatePolicyDto } from "~modules/pre-built/3-policies/dto/create-policy.dto";
import { PolicyGroupService } from "~modules/pre-built/3-policy-groups/policy-group.service";
import { CreateSystemMenuDto } from "~modules/pre-built/4-system-menus/dto/create-system-menu.dto";
import { SystemMenuService } from "~modules/pre-built/4-system-menus/system-menu.service";
import { PolicyService } from "~pre-built/3-policies/policy.service";
import { ProvinceService } from "~pre-built/8-provinces/province.service";
import { DistrictService } from "~pre-built/9-districts/district.service";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";
import { convertToTitleCase } from "~utils/common.util";

@Injectable()
export class SeedService {
  constructor(
    private provinceService: ProvinceService,
    private districtService: DistrictService,
    private wardService: WardService,
    private policyGroupService: PolicyGroupService,
    private policyService: PolicyService,
    private systemMenuService: SystemMenuService,
    private logger: CustomLoggerService,
  ) {}

  async seedProvincesDistrictsWards() {
    const jsonPath = join(process.cwd(), "src", "utils", "json", "data_vn_units.json");
    const isFileExist = existsSync(jsonPath);

    //  check file exist
    if (!isFileExist) {
      this.logger.error(`${jsonPath} was not found, cannot seed provinces`, SeedService.name);

      return;
    }

    //  Read data file
    const dataString = readFileSync(jsonPath).toString().trim();

    // Convert data string to JSON
    const data: Record<string, any>[] = JSON.parse(dataString);

    let provincePosition = 0;
    let totalDistricts = 0;
    let totalWards = 0;
    for (const pItem of data) {
      provincePosition++;

      const provinceItem = {
        position: provincePosition,
        name: pItem.Name,
        nameEn: pItem.NameEn,
        fullName: pItem.FullName,
        fullNameEn: pItem.FullNameEn,
        codeName: pItem.CodeName,
        administrativeUnit: pItem.AdministrativeUnit?.ShortName,
        administrativeUnitEn: pItem.AdministrativeUnit?.ShortNameEn,
        administrativeRegion: pItem.AdministrativeRegion?.Name,
        administrativeRegionEn: pItem.AdministrativeRegion?.NameEn,
      };

      const provinceCreated = await this.provinceService.updateOne(
        {
          codeName: provinceItem.codeName,
        },
        provinceItem,
        { upsert: true, new: true },
      );

      // Create Districts and Wards
      await Promise.all(
        pItem.District.map(async (dItem: Record<string, any>, districtPosition: number) => {
          // Create District
          const districtItem = {
            provinceId: provinceCreated._id,
            position: districtPosition + 1,
            name: dItem.Name,
            nameEn: dItem.nameEn,
            fullName: dItem.FullName,
            fullNameEn: dItem.FullNameEn,
            codeName: dItem.CodeName,
            administrativeUnit: dItem.AdministrativeUnit?.ShortName,
            administrativeUnitEn: dItem.AdministrativeUnit?.ShortNameEn,
          };

          const districtCreated = await this.districtService.updateOne(
            {
              codeName: districtItem.codeName,
            },
            districtItem,
            { upsert: true, new: true },
          );

          // Create Wards
          await Promise.all(
            dItem.Ward.map((wItem: Record<string, any>, wardPosition: number) => {
              totalWards++;

              const wardItem = {
                provinceId: provinceCreated._id,
                districtId: districtCreated._id,
                name: wItem.Name,
                nameEn: wItem.NameEn,
                fullName: wItem.FullName,
                fullNameEn: wItem.FullNameEn,
                codeName: wItem.CodeName,
                position: wardPosition + 1,
                administrativeUnit: wItem.AdministrativeUnit?.ShortName,
                administrativeUnitEn: wItem.AdministrativeUnit?.ShortNameEn,
              };

              return this.wardService.updateOne(
                {
                  codeName: wardItem.codeName,
                },
                wardItem,
                { upsert: true, new: true },
              );
            }),
          );

          totalDistricts++;

          return districtCreated;
        }),
      );
    }

    this.logger.log(
      {
        totalProvinces: provincePosition,
        totalDistricts,
        totalWards,
      },
      "Seeded(provinces,districts,wards)",
    );
  }

  async seedPolicies(routerStacks: any[]) {
    const policyMap = new Map<string, CreatePolicyDto>();

    routerStacks
      .filter(({ route }) => route && route.path)
      .forEach(({ route }) => {
        const endpoint = removeTrailingSlash(route.path);
        const method = route.stack[0]?.method?.toUpperCase();
        const collectionName = endpoint.split("/")[2]?.replace("_", "-") || "#";

        const policyKey = `${method}:${endpoint}`;

        const policyItem: CreatePolicyDto = {
          name: `${method} ${endpoint}`,
          collectionName,
          endpoint,
          method,
          policyKey,
        };

        if (!policyMap.has(policyKey)) policyMap.set(policyKey, policyItem);
      });

    await this._createPoliciesAndMenus(policyMap);
    await this._addSupperAdminToPolicies();

    policyMap.clear();
  }

  private async _createPoliciesAndMenus(policyMap: Map<string, CreatePolicyDto>) {
    const collectionNameSet = new Set<string>();

    // Create policies
    const polices: Record<string, any>[] = [];
    for (const [_, policy] of policyMap) {
      const res = await this.policyService.findOne({
        endpoint: policy.endpoint,
        method: policy.method,
      });

      if (!res) polices.push(policy);

      collectionNameSet.add(policy.collectionName);
    }

    // Create policy group
    for (const policy of polices) {
      const res = await this.policyGroupService.findOne({
        collectionName: policy.collectionName,
      });

      if (res) {
        policy.policyGroupId = res._id;
      } else {
        const policyGroupCreated = await this.policyGroupService.create({
          name: convertToTitleCase(policy.collectionName),
          collectionName: policy.collectionName,
          description: `${policy.name} policy group`,
        });

        policy.policyGroupId = policyGroupCreated._id;
      }
    }

    await this.policyService.createMany(polices);
    await this._createMenus(Array.from(collectionNameSet));
  }

  private async _createMenus(collectionNames: string[]) {
    let position = 1;
    for (const collectionName of collectionNames) {
      const menuItem: CreateSystemMenuDto = {
        name: convertToTitleCase(collectionName),
        href: collectionName,
        position,
        isHorizontal: false,
        isShow: true,
        isSystem: true,
        isGroup: false,
      };

      await this.systemMenuService.updateOne({ name: menuItem.name }, menuItem, {
        upsert: true,
      });

      position++;
    }
  }

  private async _addSupperAdminToPolicies() {
    const policies = await this.policyService.updateMany(
      {},
      {
        $addToSet: {
          userIds: EnvStatic.getAppConfig().supperAdminIds,
        },
      },
    );

    this.logger.log(`Total policies: '${policies.matchedCount}'`, SeedService.name);
  }
}
