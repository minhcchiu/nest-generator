import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Product, ProductDocument } from "./schemas/product.schema";
import { ClothingDocument } from "./schemas/clothing.schema";
import { ElectronicDocument } from "./schemas/electronic.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductType } from "./enums/product-type.enum";

@Injectable()
export class ProductService extends BaseService<ProductDocument> {
	private clothingModel: PaginateModel<ClothingDocument>;
	private electronicModel: PaginateModel<ElectronicDocument>;

	constructor(
		@InjectModel(Product.name) model: PaginateModel<ProductDocument>,
		@InjectModel(Product.name) _clothingModel: PaginateModel<ClothingDocument>,
		@InjectModel(Product.name)
		_electronicModel: PaginateModel<ElectronicDocument>,
	) {
		super(model);
		this.clothingModel = _clothingModel;
		this.electronicModel = _electronicModel;
	}

	async createProduct(data: CreateProductDto) {
		switch (data.type) {
			case ProductType.clothing:
				await this.clothingModel.create(data.attributes);
				break;

			case ProductType.electronics:
				await this.electronicModel.create(data.attributes);
				break;

			default:
				throw new BadRequestException("Product type not found.");
		}

		return this.create(data);
	}
}
