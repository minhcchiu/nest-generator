import { IsMongoId, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";
import { CartProductDto } from "./cart-product.dto";

export class AddToCartDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly userId: string;

	@IsNotEmpty()
	@Type(() => CartProductDto)
	readonly product: CartProductDto;
}
