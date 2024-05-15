import { Injectable } from "@nestjs/common";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { removeTrailingSlash } from "~helpers/remove-trailing-slash";
import { WardService } from "~pre-built/10-wards/ward.service";

import { CreatePolicyDto } from "~modules/pre-built/3-policies/dto/create-policy.dto";
import { PolicyService } from "~pre-built/3-policies/policy.service";
import { MenuService } from "~pre-built/4-menus/menu.service";
import { ProvinceService } from "~pre-built/8-provinces/province.service";
import { DistrictService } from "~pre-built/9-districts/district.service";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";

@Injectable()
export class SeedService {
	constructor(
		private provinceService: ProvinceService,
		private districtService: DistrictService,
		private wardService: WardService,
		private policyService: PolicyService,
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
						const districtSaved =
							await this.districtService.create(districtItem);

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

	async seedPolicies(routerStacks: any[]) {
		const policyMap = new Map<string, CreatePolicyDto>();

		routerStacks
			.filter(({ route }) => route && route.path)
			.forEach(({ route }) => {
				const endpoint = removeTrailingSlash(route.path);
				const collectionName = endpoint.split("/")[2]?.replace("_", "") || "#";
				const method = route.stack[0]?.method?.toUpperCase();
				const policyKey = `${collectionName}.${method}:${endpoint}`;

				const policyItem: CreatePolicyDto = {
					policyKey,
					name: policyKey,
					collectionName: collectionName,
					endpoint,
					method,
				};

				if (!policyMap.has(policyKey)) policyMap.set(policyKey, policyItem);
			});

		await this._createPoliciesAndMenus(policyMap);

		this.logger.log(`Total policies: '${policyMap.size}'`, SeedService.name);
		policyMap.clear();
	}

	private async _createPoliciesAndMenus(
		policyMap: Map<string, CreatePolicyDto>,
	) {
		const collectionNameSet = new Set<string>();

		const polices: Record<string, any>[] = [];
		for (const [_, policy] of policyMap) {
			collectionNameSet.add(policy.collectionName);

			const res = await this.policyService.findOne({
				endpoint: policy.endpoint,
				method: policy.method,
			});

			if (!res) polices.push(policy);
		}

		await this.policyService.createMany(polices);
		await this._createMenus(Array.from(collectionNameSet));
	}

	private async _createMenus(collectionNames: string[]) {
		collectionNames.forEach(async (collectionName, position) => {
			const menuItem = {
				name: collectionName,
				collectionName,
				href: collectionName,
				position,
				isHorizontal: false,
				isShow: true,
			};

			await this.menuService.updateOne({ collectionName }, menuItem, {
				upsert: true,
			});
		});
	}
}
