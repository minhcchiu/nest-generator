import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";
import { CartProductDto } from "./cart-product.dto";

export class AddProductToCartDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly userId: Types.ObjectId;

	@IsNotEmpty()
	@Type(() => CartProductDto)
	readonly product: CartProductDto;
}
