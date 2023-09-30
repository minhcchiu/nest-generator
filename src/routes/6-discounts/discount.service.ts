import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Discount, DiscountDocument } from "./schemas/discount.schema";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { AqpDto } from "~dto/aqp.dto";
import { DiscountAppliesToEnum } from "./enums/discount-applies-to.enum";
import { ProductService } from "~routes/1-products/product.service";

@Injectable()
export class DiscountService extends BaseService<DiscountDocument> {
	private discountModel: PaginateModel<DiscountDocument>;
	constructor(
		@InjectModel(Discount.name) _model: PaginateModel<DiscountDocument>,
		private readonly productService: ProductService,
	) {
		super(_model);
		this.discountModel = _model;
	}

	async create(input: CreateDiscountDto) {
		const foundDiscount = await this.discountModel
			.findOne({
				code: input.code,
				shopId: input.shopId,
			})
			.lean();

		if (foundDiscount && foundDiscount.isActive)
			throw new NotFoundException("Discount exists!");

		return this.discountModel.create(input);
	}

	async getAllDiscountCodesWithProduct({ filter, ...productOptions }: AqpDto) {
		const foundDiscount = await this.findOne(filter);

		if (!foundDiscount || !foundDiscount.isActive)
			throw new NotFoundException("Discount not exists!");

		// find all products
		const productsFilter: Record<string, any> = {
			isPublished: true,
			shopId: foundDiscount.shopId,
		};

		// find products by specific products
		if (foundDiscount.appliesTo === DiscountAppliesToEnum.SPECIFIC) {
			Object.assign(productsFilter, {
				_id: { $in: foundDiscount.productIds },
			});
		}

		const pagination = await this.productService.paginate(
			productsFilter,
			productOptions,
		);

		return pagination;
	}
}
