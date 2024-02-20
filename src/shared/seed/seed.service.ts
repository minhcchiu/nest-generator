import { join } from "path";
import { removeTrailingSlash } from "~helpers/remove-trailing-slash";
import { WardService } from "~pre-built/10-wards/ward.service";
import { EndpointService } from "~pre-built/2-endpoints/endpoint.service";
import { ProvinceService } from "~pre-built/8-provinces/province.service";
import { DistrictService } from "~pre-built/9-districts/district.service";
import { PermissionService } from "~routes/pre-built/2-permissions/permission.service";
import { MenuService } from "~routes/pre-built/3-menus/menu.service";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";

import { Injectable } from "@nestjs/common";

import { IEndpoint } from "./interfaces/endpoint.interface";
import { IPermission } from "./interfaces/permission.interface";
import { existsSync, readFileSync } from "fs";

@Injectable()
export class SeedService {
	constructor(
		private provinceService: ProvinceService,
		private districtService: DistrictService,
		private wardService: WardService,
		private permissionService: PermissionService,
		private endpointService: EndpointService,
		private menuService: MenuService,
		private logger: CustomLoggerService,
	) {}

	async seedProvincesDistrictsWards() {
		const jsonPath = join(
			__dirname,
			"../../",
			"utils/json/provinces-districts-wards.json",
		);
		const isFileExist = existsSync(jsonPath);

		//  check file exist
		if (!isFileExist)
			this.logger.error(
				SeedService.name,
				`${jsonPath} was not found, cannot seed provinces`,
			);

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

		await Promise.all(
			data.map(async (province: any) => {
				const provinceItem = {
					name: province.name,
					type: province.type,
				};

				// Save province
				const provinceSaved = await this.provinceService.create(provinceItem);

				// Get provinceId
				const provinceId = provinceSaved._id;

				const createDistrictsAndWardsPromises = province.districts.map(
					async (district: any) => {
						const districtItem = {
							provinceId,
							name: district.name,
							type: district.type,
						};

						// Save district
						const districtSaved = await this.districtService.create(
							districtItem,
						);

						// Get districtId
						const districtId = districtSaved._id;

						// Store wards of districts
						const wardSavedPromises = district.wards.map((ward: any) => {
							const wardItem = {
								provinceId,
								districtId,
								name: ward.name,
								type: ward.type,
							};

							return this.wardService.create(wardItem);
						});

						// Save wards
						await Promise.all(wardSavedPromises);
					},
				);

				await Promise.all(createDistrictsAndWardsPromises);
			}),
		);

		return {
			message: "Seed data for all provinces, districts, wards successfully!",
		};
	}

	async seedEndpoints(routerStacks: any[]) {
		const permissionsMap = new Map<string, IPermission>();

		const endpointsMap = new Map<string, IEndpoint>();

		routerStacks
			.filter(({ route }) => route && route.path)
			.forEach(({ route }) => {
				const path = removeTrailingSlash(route.path);
				const prefix = path.split("/")[2] || "#";
				const method = route.stack[0]?.method?.toUpperCase();

				const endpointItem: IEndpoint = { method, path, prefix, name: prefix };
				const endpointKey = `${endpointItem.method}-${endpointItem.path}`;

				if (!permissionsMap.has(prefix)) {
					permissionsMap.set(prefix, {
						prefix,
						position: permissionsMap.size + 1,
						name: prefix,
					});
				}

				if (!endpointsMap.has(endpointKey))
					endpointsMap.set(endpointKey, endpointItem);
			});

		await this._createPermissionsAndMenusFromMap(permissionsMap);
		await this._createEndpointsFromMap(endpointsMap);

		this.logger.log(
			`Total endpoints/groups: '${endpointsMap.size}/${permissionsMap.size}' `,
			SeedService.name,
		);

		permissionsMap.clear();
		endpointsMap.clear();
	}

	private async _createEndpointsFromMap(endpointsMap: Map<string, IEndpoint>) {
		endpointsMap.forEach(async (endpoint) => {
			const endpointExist = await this.endpointService.findOne({
				path: endpoint.path,
				method: endpoint.method,
			});

			if (!endpointExist) {
				const endpointDoc = await this.endpointService.create(endpoint);

				await this.permissionService.updateOne(
					{ prefix: endpointDoc.prefix },
					{ $addToSet: { endpoints: endpointDoc._id } },
				);
			}
		});
	}

	private async _createPermissionsAndMenusFromMap(
		permissionsMap: Map<string, IPermission>,
	) {
		permissionsMap.forEach(async ({ prefix, position }) => {
			const [permissionExist, menuExist] = await Promise.all([
				this.permissionService.count({ prefix }),
				this.menuService.count({ prefix }),
			]);

			const permissionItem: IPermission = { prefix, name: prefix, position };

			const menuItem = {
				prefix,
				name: prefix,
				level: 1,
				position,
				url: `${prefix}`,
				isHorizontal: false,
				isActive: true,
			};

			if (!permissionExist) {
				await this.permissionService.create(permissionItem);
			}

			if (!menuExist) {
				await this.menuService.create(menuItem);
			}
		});
	}

	private async _deleteEndpoints() {
		return Promise.all([
			this.permissionService.deleteMany({}),
			this.menuService.deleteMany({}),
			this.endpointService.deleteMany({}),
		]);
	}
}
