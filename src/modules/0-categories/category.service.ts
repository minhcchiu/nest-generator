import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Category, CategoryDocument } from "./schemas/category.schema";

@Injectable()
export class CategoryService extends BaseService<CategoryDocument> {
  constructor(@InjectModel(Category.name) model: Model<CategoryDocument>) {
    super(model);
  }
}
