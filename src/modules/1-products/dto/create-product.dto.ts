import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";
import { ProductType } from "../enums/product-type.enum";

export class CreateProductDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly shopId: ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly thumbnail: string;

  @IsOptional()
  @IsString()
  readonly desc: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(ProductType)
  readonly type: ProductType;

  @IsObject()
  readonly attributes: Record<string, any>;
}
