import {
	IsArray,
	IsBoolean,
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateIf,
} from "class-validator";
import { Types } from "mongoose";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";
import { DiscountAppliesToEnum } from "../enums/discount-applies-to.enum";
import { DiscountTypeEnum } from "../enums/discount-type.enum";

export class CreateDiscountDto {
	@IsNotEmpty()
	@IsObjectId()
	@ToObjectId()
	shopId: Types.ObjectId;

	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	code: string;

	@IsNotEmpty()
	@IsString()
	description: string;

	@IsNotEmpty()
	@IsString()
	@IsEnum(DiscountTypeEnum)
	type: DiscountTypeEnum;

	@IsNotEmpty()
	@IsNumber()
	value: number;

	@IsNotEmpty()
	@IsDateString()
	startDate: string;

	@IsNotEmpty()
	@IsDateString()
	endDate: string;

	@IsNotEmpty()
	@IsNumber()
	maxUses: number;

	@IsNotEmpty()
	@IsNumber()
	usesCount: number;

	@IsOptional()
	@IsObjectId({ each: true })
	@ToObjectId({ each: true })
	usersUsed?: Types.ObjectId[] = [];

	@IsOptional()
	@IsNumber()
	maxUsersPerUser: number;

	@IsNotEmpty()
	@IsNumber()
	minOrderValue: number;

	@IsOptional()
	@IsBoolean()
	isActive: boolean;

	@IsNotEmpty()
	@IsEnum(DiscountAppliesToEnum)
	appliesTo: DiscountAppliesToEnum;

	@ValidateIf((o) => o.appliesTo === DiscountAppliesToEnum.SPECIFIC)
	@IsNotEmpty()
	@IsArray()
	@IsObjectId({ each: true })
	@ToObjectId({ each: true })
	productIds: Types.ObjectId[];
}
