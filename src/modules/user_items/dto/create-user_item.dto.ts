import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";
import { ObjectDto } from "~modules/user_items/dto/object.dto";
import { Object2Dto } from "~modules/user_items/dto/object2.dto";
import { OrderItemsDto } from "~modules/user_items/dto/order_item.dto";
import { UserDistrictDto } from "~modules/user_items/dto/user_district.dto";
import { UserMenuDto } from "~modules/user_items/dto/user_menu.dto";

export class CreateUserItemDto {
  @IsNotEmpty()
  @IsObjectId()
  userId: ObjectId;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountValue: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  expiresAt: Date;

  @IsOptional()
  @IsArray()
  strings?: Array<string>;

  @IsOptional()
  @IsArray()
  notifications?: Array<ObjectId>;

  @IsOptional()
  @IsObject()
  @Type(() => ObjectDto)
  @ValidateNested()
  object?: ObjectDto;

  @IsOptional()
  @IsObject()
  @Type(() => Object2Dto)
  @ValidateNested()
  object2?: Object2Dto;

  @IsOptional()
  @IsNumber({}, { each: true })
  numbers?: Array<number>;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderItemsDto)
  @IsArray()
  orderItems?: Array<OrderItemsDto>;

  @IsOptional()
  @IsObject()
  @Type(() => UserMenuDto)
  @ValidateNested()
  userMenu?: UserMenuDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UserDistrictDto)
  @IsArray()
  userDistrict?: Array<UserDistrictDto>;
}
