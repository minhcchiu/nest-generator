import { Module } from "@nestjs/common";
import { UserGroupModule } from "~modules/pre-built/2-user-groups/user-group.module";
import { WardModule } from "~pre-built/10-wards/ward.module";
import { PolicyModule } from "~pre-built/3-policies/policy.module";
import { MenuModule } from "~pre-built/4-menus/menu.module";
import { ProvinceModule } from "~pre-built/8-provinces/province.module";
import { DistrictModule } from "~pre-built/9-districts/district.module";
import { SeedController } from "./seed.controller";
import { SeedService } from "./seed.service";
@Module({
	imports: [
		PolicyModule,
		MenuModule,
		UserGroupModule,
		ProvinceModule,
		DistrictModule,
		WardModule,
	],
	controllers: [SeedController],
	providers: [SeedService],
})
export class SeedModule {}
