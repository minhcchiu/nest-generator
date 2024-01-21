import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Category, CategoryDocument } from "./schemas/category.schema";

@Injectable()
export class CategoryService extends BaseService<CategoryDocument> {
	constructor(
		@InjectModel(Category.name) model: PaginateModel<CategoryDocument>,
	) {
		super(model);
	}
}
