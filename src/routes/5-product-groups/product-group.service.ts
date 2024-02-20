import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import {
	ProductGroup,
	ProductGroupDocument,
} from "./schemas/product-group.schema";

@Injectable()
export class ProductGroupService extends BaseService<ProductGroupDocument> {
	constructor(
		@InjectModel(ProductGroup.name) model: PaginateModel<ProductGroupDocument>,
	) {
		super(model);
	}
}
