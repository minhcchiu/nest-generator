import { Type } from "class-transformer";
import {
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	ValidateNested,
} from "class-validator";

export class CheckoutReviewDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly userId: string;

	@IsNotEmpty()
	@IsMongoId()
	readonly carId: string;

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ShopOrderDto)
	shopOrders: ShopOrderDto[];
}

export class ShopOrderDiscountDto {
	@IsNotEmpty()
	@IsMongoId()
	shopId: string;

	@IsNotEmpty()
	@IsMongoId()
	discountId: string;

	@IsNotEmpty()
	@IsMongoId()
	codeId: string;
}

export class ShopOrderItemDto {
	@IsNotEmpty()
	@IsMongoId()
	productId: string;

	@IsNotEmpty()
	@IsNumber()
	price: number;

	@IsNotEmpty()
	@IsNumber()
	quantity: number;
}

export class ShopOrderDto {
	shopId: string;
	shopDiscounts: ShopOrderDiscountDto[];
	items: ShopOrderItemDto[];
}
