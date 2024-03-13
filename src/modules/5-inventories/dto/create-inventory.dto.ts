import {
	IsArray,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

export class CreateInventoryDto {
	@IsNotEmpty()
	@IsMongoId()
	shopId: string;

	@IsMongoId()
	@IsNotEmpty()
	productId: string;

	@IsOptional()
	@IsString()
	location?: string = "unknown";

	@IsNotEmpty()
	@IsNumber()
	stock: number;

	@IsOptional()
	@IsArray()
	reservations?: string[] = [];
}
