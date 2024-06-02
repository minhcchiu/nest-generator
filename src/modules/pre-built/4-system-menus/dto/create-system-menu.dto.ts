import {
	IsBoolean,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";
import { Types } from "mongoose";

export class CreateSystemMenuDto {
	@IsOptional()
	@IsMongoId()
	readonly parentId?: Types.ObjectId;

	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsOptional()
	@IsString()
	readonly collectionName?: string;

	@IsOptional()
	@IsBoolean()
	readonly isGroup: boolean;

	@IsOptional()
	@IsString()
	readonly icon?: string;

	@IsOptional()
	@IsString()
	readonly href?: string;

	@IsOptional()
	@IsNumber()
	readonly position?: number;

	@IsOptional()
	@IsBoolean()
	readonly isHorizontal?: boolean;

	@IsOptional()
	@IsBoolean()
	readonly isShow?: boolean;
}
