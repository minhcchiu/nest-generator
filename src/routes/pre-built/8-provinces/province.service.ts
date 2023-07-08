import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Province, ProvinceDocument } from "./schemas/province.schema";

@Injectable()
export class ProvinceService extends BaseService<ProvinceDocument> {
	constructor(
		@InjectModel(Province.name) model: PaginateModel<ProvinceDocument>,
	) {
		super(model);
	}
}
