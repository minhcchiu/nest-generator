import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Ward, WardDocument } from "./schemas/ward.schema";
@Injectable()
export class WardService extends BaseService<WardDocument> {
	constructor(@InjectModel(Ward.name) model: PaginateModel<WardDocument>) {
		super(model);
	}
}
