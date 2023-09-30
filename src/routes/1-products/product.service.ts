import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Product, ProductDocument } from "./schemas/product.schema";
import { Clothing, ClothingDocument } from "./schemas/clothing.schema";
import { Electronic, ElectronicDocument } from "./schemas/electronic.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductType } from "./enums/product-type.enum";
import { InventoryService } from "~routes/5-inventories/inventory.service";
import { CreateInventoryDto } from "~routes/5-inventories/dto/create-inventory.dto";
import { ProductModule } from "./product.module";
import { Furniture, FurnitureDocument } from "./schemas/furniture.schema";

@Injectable()
export class ProductService extends BaseService<ProductDocument> {
	private clothingModel: PaginateModel<ClothingDocument>;
	private electronicModel: PaginateModel<ElectronicDocument>;
	private productModel: PaginateModel<ProductModule>;
	private furnitureModel: PaginateModel<ProductModule>;

	constructor(
		@InjectModel(Product.name) _productModel: PaginateModel<ProductDocument>,
		@InjectModel(Clothing.name) _clothingModel: PaginateModel<ClothingDocument>,
		@InjectModel(Electronic.name)
		_electronicModel: PaginateModel<ElectronicDocument>,
		@InjectModel(Furniture.name)
		_furnitureModel: PaginateModel<FurnitureDocument>,

		private readonly inventoryService: InventoryService,
	) {
		super(_productModel);

		this.productModel = _productModel;
		this.clothingModel = _clothingModel;
		this.electronicModel = _electronicModel;
		this.furnitureModel = _furnitureModel;
	}

	async createProduct(input: CreateProductDto) {
		const product = await this._createProductByType(input.type, input);

		// return this._addInventory({
		// 	productId: product._id.toString(),
		// 	shopId: input.shopId,
		// 	stock: input.quantity,
		// });

		return product;
	}

	private _addInventory(input: CreateInventoryDto) {
		return this.inventoryService.create(input);
	}

	private async _createProductByType(
		productType: ProductType,
		input: CreateProductDto,
	) {
		console.log({ input });

		switch (productType) {
			case ProductType.clothing:
				await this.clothingModel.create(input.attributes);
				break;

			case ProductType.electronics:
				await this.electronicModel.create(input.attributes);
				break;

			case ProductType.electronics:
				await this.furnitureModel.create(input.attributes);
				break;

			default:
				throw new BadRequestException("Product type not found.");
		}

		return this.productModel.create(input);
	}
}
