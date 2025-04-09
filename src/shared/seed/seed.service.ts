import { Injectable } from "@nestjs/common";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { removeTrailingSlash } from "~helpers/remove-trailing-slash";
import { WardService } from "~pre-built/10-wards/ward.service";

import { ObjectId } from "mongodb";
import { EnvStatic } from "src/configurations/static.env";
import { HashingService } from "~modules/pre-built/1-users/hashing/hashing.service";
import { UserService } from "~modules/pre-built/1-users/user.service";
import { RoleService } from "~modules/pre-built/2-roles/role.service";
import { CreatePolicyDto } from "~modules/pre-built/3-policies/dto/create-policy.dto";
import { CreateResourceDto } from "~modules/pre-built/3-resources/dto/create-resource.dto";
import { ResourceService } from "~modules/pre-built/3-resources/resource.service";
import { CreateSystemMenuDto } from "~modules/pre-built/4-system-menus/dto/create-system-menu.dto";
import { SystemMenuService } from "~modules/pre-built/4-system-menus/system-menu.service";
import { PolicyService } from "~pre-built/3-policies/policy.service";
import { ProvinceService } from "~pre-built/8-provinces/province.service";
import { DistrictService } from "~pre-built/9-districts/district.service";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";
import { convertToTitleCase } from "~utils/common.util";
import { HttpMethodActions, ROLES_DEFAULT, SUPPER_ADMIN_ACCOUNT } from "~utils/constant";

@Injectable()
export class SeedService {
  constructor(
    private provinceService: ProvinceService,
    private districtService: DistrictService,
    private wardService: WardService,
    private resourceService: ResourceService,
    private policyService: PolicyService,
    private roleService: RoleService,
    private userService: UserService,
    private hashingService: HashingService,
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
        sortOrder: provincePosition,
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
            sortOrder: districtPosition + 1,
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
                sortOrder: wardPosition + 1,
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

  async seedRolesDefault() {
    const rolesCreated = await Promise.all(
      Object.values(ROLES_DEFAULT).map(roleDefault =>
        this.roleService.updateOne(
          { key: roleDefault },
          {
            name: roleDefault,
            key: roleDefault,
          },
          {
            upsert: true,
            new: true,
          },
        ),
      ),
    );

    this.logger.log({
      message: "Seeded roles",
      roles: rolesCreated.map(item => item.name),
    });
  }
  async seedSupperAdmin() {
    const roleSupperAdminId = (await this.roleService.getRoleSupperAdmin())._id;
    const hashPassword = await this.hashingService.hash(SUPPER_ADMIN_ACCOUNT.password);

    let supperAdminCreated = await this.userService.updateOne(
      {
        username: SUPPER_ADMIN_ACCOUNT.username,
      },
      {
        ...SUPPER_ADMIN_ACCOUNT,
        password: hashPassword,
        $addToSet: { roleIds: roleSupperAdminId },
      },
      { new: true },
    );

    if (!supperAdminCreated) {
      supperAdminCreated = await this.userService.create({
        ...SUPPER_ADMIN_ACCOUNT,
        password: hashPassword,
        roleIds: [roleSupperAdminId],
      });
    }

    await this.policyService.updateMany(
      {},
      {
        $addToSet: {
          roleIds: roleSupperAdminId,
        },
      },
    );

    this.logger.log({
      message: "Seeded supper admin",
      supperAdmin: {
        username: supperAdminCreated.username,
        email: supperAdminCreated.email,
        roleIds: supperAdminCreated.roleIds,
      },
    });
  }

  async seedResourcesAndPolicies(routerStacks: any[]) {
    const adminAccount = await this.userService.getAdminAccount();
    const resourceMap = new Map<string, CreateResourceDto>();
    const policyMap = new Map<string, CreatePolicyDto>();

    routerStacks
      .filter(({ route }) => route && route.path)
      .forEach(async ({ route }) => {
        const endpoint = removeTrailingSlash(route.path);
        const method = route.stack[0]?.method?.toUpperCase();
        const resourceKey = endpoint.split("/")[2] || "#";

        const resourceItem: CreateResourceDto = {
          createdBy: adminAccount._id,
          name: convertToTitleCase(resourceKey.replace("_", " ")),
          relationResourceIds: [],
          resourceKey,
          description: `Manage ${convertToTitleCase(resourceKey)}`,
        };

        const policyItem: CreatePolicyDto = {
          name: `${HttpMethodActions[method]}`,
          endpoint,
          method,
          policyKey: `${method}:${endpoint}`,
          resourceKey,
        };

        if (!resourceMap.has(policyItem.resourceKey))
          resourceMap.set(resourceItem.resourceKey, resourceItem);
        if (!policyMap.has(policyItem.policyKey)) policyMap.set(policyItem.policyKey, policyItem);
      });

    await this._createResources(Array.from(resourceMap.values()));
    await this._createPolicies(Array.from(policyMap.values()));
    await this._addSupperAdminToPolicies();

    policyMap.clear();
  }

  async _createResources(resources: CreateResourceDto[]) {
    await Promise.all(
      resources.map(item =>
        this.resourceService.updateOne({ resourceKey: item.resourceKey }, item, {
          upsert: true,
        }),
      ),
    );
  }

  private async _createPolicies(policies: CreatePolicyDto[]) {
    const resources = await this.resourceService.findMany({});
    const resourcesMap = new Map<string, ObjectId>(
      resources.map(item => [item.resourceKey, item._id]),
    );

    const policesExists = await this.policyService.distinct("policyKey");

    const policiesItemNew = policies.filter(item => !policesExists.includes(item.policyKey));

    await this.policyService.createMany(
      policiesItemNew.map(item => ({
        ...item,
        resourceId: resourcesMap.get(item.resourceKey),
      })),
    );
  }

  private async _createMenus(policyKeys: string[]) {
    let sortOrder = 1;
    for (const key of policyKeys) {
      const menuItem: CreateSystemMenuDto = {
        name: convertToTitleCase(key),
        href: key,
        sortOrder,
        isHorizontal: false,
        isShow: true,
        isSystem: true,
        isGroup: false,
      };

      await this.systemMenuService.updateOne({ name: menuItem.name }, menuItem, {
        upsert: true,
      });

      sortOrder++;
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
