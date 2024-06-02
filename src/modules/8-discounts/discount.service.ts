import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Discount, DiscountDocument } from "./schemas/discount.schema";

@Injectable()
export class DiscountService extends BaseService<DiscountDocument> {
	constructor(@InjectModel(Discount.name) model: Model<DiscountDocument>) {
		super(model);
	}
}
