import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CartProductDto {
  @IsNotEmpty()
  @IsObjectId()
  productId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  shopId: ObjectId;

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
