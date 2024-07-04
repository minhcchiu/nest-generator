import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class OrderProductDto {
	@IsNotEmpty()
	@IsObjectId()
	@ToObjectId()
	productId: string;

	@IsNotEmpty()
	@IsNumber()
	quantity: number;

	@IsOptional()
	@IsNumber()
	mass?: number;

	@IsOptional()
	@IsNumber()
	price?: number;
}
