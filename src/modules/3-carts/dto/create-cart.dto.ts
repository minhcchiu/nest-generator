import { Type } from "class-transformer";
import {
	IsMongoId,
	IsNotEmpty,
	IsOptional,
	ValidateNested,
} from "class-validator";
import { CartProductDto } from "./cart-product.dto";
export class CreateCartDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly userId: string;
	@IsOptional()
	@ValidateNested()
	@Type(() => CartProductDto)
	readonly products: CartProductDto[];
}
