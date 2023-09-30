import {
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

export class CartProductDto {
	@IsNotEmpty()
	@IsMongoId()
	productId: string;

	@IsNotEmpty()
	@IsMongoId()
	shopId: string;

	@IsOptional()
	@IsMongoId()
	quantity: number;

	@IsOptional()
	@IsString()
	name: string;

	@IsOptional()
	@IsNumber()
	price: number;
}
