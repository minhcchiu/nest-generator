import {
	IsArray,
	IsBoolean,
	IsDate,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	MinDate,
} from "class-validator";
import { DiscountTypeEnum } from "../enums/discount-type.enum";
import { DiscountAppliesToEnum } from "../enums/discount-applies-to.enum";

export class CreateDiscountDto {
	@IsNotEmpty()
	@IsMongoId()
	shopId: string;

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
	@IsDate()
	@MinDate(new Date())
	startDate: Date;

	@IsNotEmpty()
	@IsDate()
	@MinDate(new Date())
	endDate: Date;

	@IsNotEmpty()
	@IsNumber()
	maxUses: number;

	@IsNotEmpty()
	@IsNumber()
	usesCount: number;

	@IsOptional()
	@IsMongoId({ each: true })
	usersUsed?: string[] = [];

	@IsOptional()
	@IsNumber()
	maxUsersPerUser: number;

	@IsNotEmpty()
	@IsNumber()
	minOrderValue: number;

	@IsOptional()
	@IsBoolean()
	isActive: boolean;

	@IsOptional()
	@IsEnum(DiscountAppliesToEnum)
	appliesTo: DiscountAppliesToEnum;

	@IsOptional()
	@IsArray()
	@IsMongoId({ each: true })
	productIds: string[];
}
