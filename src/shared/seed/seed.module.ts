import { Module } from "@nestjs/common";
import { HashingService } from "~modules/pre-built/1-users/hashing/hashing.service";
import { RoleModule } from "~modules/pre-built/2-roles/role.module";
import { ResourceModule } from "~modules/pre-built/3-resources/resource.module";
import { SystemMenuModule } from "~modules/pre-built/4-system-menus/system-menu.module";
import { WardModule } from "~pre-built/10-wards/ward.module";
import { PolicyModule } from "~pre-built/3-policies/policy.module";
import { ProvinceModule } from "~pre-built/8-provinces/province.module";
import { DistrictModule } from "~pre-built/9-districts/district.module";
import { SeedService } from "./seed.service";

@Module({
  imports: [
    ResourceModule,
    PolicyModule,
    SystemMenuModule,
    ProvinceModule,
    DistrictModule,
    WardModule,
    RoleModule,
  ],
  providers: [SeedService, HashingService],
})
export class SeedModule {}
