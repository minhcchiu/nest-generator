import {
	IsArray,
	IsBoolean,
	IsMongoId,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";
import { Types } from "mongoose";

export class CreateMenuDto {
	@IsOptional()
	@IsArray()
	@IsMongoId({ each: true })
	readonly menuGroupIds: Types.ObjectId[];

	@IsOptional()
	@IsMongoId()
	readonly parentId?: Types.ObjectId;

	@IsOptional()
	@IsMongoId()
	readonly systemMenuId?: Types.ObjectId;

	@IsOptional()
	@IsString()
	readonly name?: string;

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
