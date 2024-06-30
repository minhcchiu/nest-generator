import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class OrderProductDto {
	@IsNotEmpty()
	@IsMongoId()
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
