import { PartialType } from "@nestjs/mapped-types";
import {
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";
import { Types } from "mongoose";
export class CartProductDto {
	@IsNotEmpty()
	@IsMongoId()
	productId: Types.ObjectId;

	@IsNotEmpty()
	@IsMongoId()
	shopId: Types.ObjectId;

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
