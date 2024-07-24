import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  shopId: Types.ObjectId;

  @IsObjectId()
  @ToObjectId()
  @IsNotEmpty()
  productId: Types.ObjectId;

  @IsOptional()
  @IsString()
  location?: string = "unknown";

  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsOptional()
  @IsArray()
  reservations?: string[] = [];
}
