import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateMenuDto {
	@IsOptional()
	@IsMongoId()
	readonly parentId?: Types.ObjectId;

	@IsOptional()
	@IsMongoId()
	readonly menuId?: Types.ObjectId;

	@IsNotEmpty()
	@IsString()
	readonly name?: string;

	@IsOptional()
	@IsString()
	readonly position?: number;

	@IsOptional()
	@IsString()
	readonly isHorizontal?: boolean;

	@IsOptional()
	@IsString()
	readonly isShow?: boolean;
}
