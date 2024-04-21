import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Setting, SettingDocument } from "./schemas/setting.schema";
@Injectable()
export class SettingService extends BaseService<SettingDocument> {
	constructor(
		@InjectModel(Setting.name) model: PaginateModel<SettingDocument>,
	) {
		super(model);
	}
}
