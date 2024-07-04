import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Types } from "mongoose";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";
import { CartProductDto } from "./cart-product.dto";

export class CreateCartDto {
	@IsNotEmpty()
	@IsObjectId()
	@ToObjectId()
	readonly userId: Types.ObjectId;

	@IsOptional()
	@ValidateNested()
	@Type(() => CartProductDto)
	readonly products: CartProductDto[];
}
