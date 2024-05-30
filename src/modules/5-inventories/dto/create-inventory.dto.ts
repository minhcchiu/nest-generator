import {
	IsArray,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";
import { Types } from "mongoose";

export class CreateInventoryDto {
	@IsNotEmpty()
	@IsMongoId()
	shopId: Types.ObjectId;

	@IsMongoId()
	@IsNotEmpty()
	productId: Types.ObjectId;

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
