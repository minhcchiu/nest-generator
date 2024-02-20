import {
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

import { PartialType } from "@nestjs/swagger";

export class CartProductDto {
	@IsNotEmpty()
	@IsMongoId()
	productId: string;

	@IsNotEmpty()
	@IsMongoId()
	shopId: string;

	@IsOptional()
	@IsNumber()
	quantity: number;

	@IsOptional()
	@IsString()
	name: string;

	@IsOptional()
	@IsNumber()
	price: number;
}

export class UpdateCartProductDto extends PartialType(CartProductDto) {
	@IsOptional()
	@IsNumber()
	oldQuantity: number;
}
