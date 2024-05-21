import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Province, ProvinceDocument } from "./schemas/province.schema";
@Injectable()
export class ProvinceService extends BaseService<ProvinceDocument> {
	constructor(@InjectModel(Province.name) model: Model<ProvinceDocument>) {
		super(model);
	}
}
