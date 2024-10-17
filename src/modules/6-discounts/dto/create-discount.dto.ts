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
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";
import { DiscountAppliesToEnum } from "../enums/discount-applies-to.enum";
import { DiscountTypeEnum } from "../enums/discount-type.enum";

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsObjectId()
  shopId: ObjectId;

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
  usersUsed?: ObjectId[] = [];

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

  @ValidateIf(o => o.appliesTo === DiscountAppliesToEnum.SPECIFIC)
  @IsNotEmpty()
  @IsArray()
  @IsObjectId({ each: true })
  productIds: ObjectId[];
}
