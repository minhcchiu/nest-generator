import { WardModule } from "~pre-built/10-wards/ward.module";
import { EndpointModule } from "~pre-built/2-endpoints/endpoint.module";
import { ProvinceModule } from "~pre-built/8-provinces/province.module";
import { DistrictModule } from "~pre-built/9-districts/district.module";
import { PermissionModule } from "~routes/pre-built/2-permissions/permission.module";
import { MenuModule } from "~routes/pre-built/3-menus/menu.module";

import { Module } from "@nestjs/common";

import { SeedController } from "./seed.controller";
import { SeedService } from "./seed.service";

@Module({
	imports: [
		EndpointModule,
		MenuModule,
		PermissionModule,
		ProvinceModule,
		DistrictModule,
		WardModule,
	],
	controllers: [SeedController],
	providers: [SeedService],
})
export class SeedModule {}
