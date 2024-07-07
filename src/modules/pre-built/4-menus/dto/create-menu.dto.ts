import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";
import { Types } from "mongoose";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CreateMenuDto {
	@IsOptional()
	@IsArray()
	@IsObjectId({ each: true })
	@ToObjectId({ each: true })
	readonly menuGroupIds: Types.ObjectId[];

	@IsOptional()
	@IsObjectId()
	@ToObjectId()
	readonly parentId?: Types.ObjectId;

	@IsOptional()
	@IsObjectId()
	@ToObjectId()
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
