import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CartProductDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  productId: Types.ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  shopId: Types.ObjectId;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  price: number;
}

export class UpdateCartProductDto extends PartialType(CartProductDto) {
  @IsOptional()
  @IsNumber()
  oldQuantity: number;
}
