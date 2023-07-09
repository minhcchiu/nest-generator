import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Product, ProductDocument } from "./schemas/product.schema";

@Injectable()
export class ProductService extends BaseService<ProductDocument> {
	constructor(
		@InjectModel(Product.name) model: PaginateModel<ProductDocument>,
	) {
		super(model);
	}
}
