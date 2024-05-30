import { Type } from "class-transformer";
import {
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	ValidateNested,
} from "class-validator";
import { Types } from "mongoose";

export class CheckoutReviewDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly userId: Types.ObjectId;

	@IsNotEmpty()
	@IsMongoId()
	readonly carId: Types.ObjectId;

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ShopOrderDto)
	shopOrders: ShopOrderDto[];
}

export class ShopOrderDiscountDto {
	@IsNotEmpty()
	@IsMongoId()
	shopId: Types.ObjectId;

	@IsNotEmpty()
	@IsMongoId()
	discountId: Types.ObjectId;

	@IsNotEmpty()
	@IsMongoId()
	code: string;
}

export class ShopOrderItemDto {
	@IsNotEmpty()
	@IsMongoId()
	productId: Types.ObjectId;

	@IsNotEmpty()
	@IsNumber()
	price: number;

	@IsNotEmpty()
	@IsNumber()
	quantity: number;
}

export class ShopOrderDto {
	shopId: Types.ObjectId;
	shopDiscounts: ShopOrderDiscountDto[];
	items: ShopOrderItemDto[];
}
