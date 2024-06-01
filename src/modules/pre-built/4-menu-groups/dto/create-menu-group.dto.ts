import { Type } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { Types } from "mongoose";
import { MenuCustomerDto } from "./menu-custom.dto";

export class CreateMenuGroupDto {
	@IsOptional()
	@IsArray()
	@IsMongoId({ each: true })
	readonly userIds?: Types.ObjectId[];

	@IsOptional()
	@IsMongoId()
	readonly parentId?: Types.ObjectId;

	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsOptional()
	@IsNumber()
	readonly position?: number;

	@IsOptional()
	@IsBoolean()
	readonly isHorizontal: boolean;

	@IsOptional()
	@IsBoolean()
	readonly isShow: boolean;

	@IsOptional()
	@IsString()
	readonly href?: string;

	@IsOptional()
	@IsString()
	readonly icon?: string;

	@IsOptional()
	@IsArray()
	@IsMongoId({ each: true })
	menuIds?: Types.ObjectId[];

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MenuCustomerDto)
	menusCustom?: MenuCustomerDto[];
}
