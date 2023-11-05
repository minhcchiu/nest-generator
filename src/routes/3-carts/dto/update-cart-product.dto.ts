import { IsMongoId, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";
import { CartProductDto } from "./cart-product.dto";

export class UpdateCartProductDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly userId: string;

	@IsNotEmpty()
	@Type(() => CartProductDto)
	readonly product: CartProductDto;
}
