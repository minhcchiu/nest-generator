import { Module } from "@nestjs/common";
import { UserGroupModule } from "~modules/pre-built/2-user-groups/user-group.module";
import { SystemMenuModule } from "~modules/pre-built/4-system-menus/system-menu.module";
import { WardModule } from "~pre-built/10-wards/ward.module";
import { PolicyModule } from "~pre-built/3-policies/policy.module";
import { ProvinceModule } from "~pre-built/8-provinces/province.module";
import { DistrictModule } from "~pre-built/9-districts/district.module";
import { SeedService } from "./seed.service";

@Module({
	imports: [
		PolicyModule,
		SystemMenuModule,
		UserGroupModule,
		ProvinceModule,
		DistrictModule,
		WardModule,
	],
	providers: [SeedService],
})
export class SeedModule {}
