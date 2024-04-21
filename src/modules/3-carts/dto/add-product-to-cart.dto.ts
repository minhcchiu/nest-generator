import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty } from "class-validator";
import { CartProductDto } from "./cart-product.dto";
export class AddProductToCartDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly userId: string;
	@IsNotEmpty()
	@Type(() => CartProductDto)
	readonly product: CartProductDto;
}
