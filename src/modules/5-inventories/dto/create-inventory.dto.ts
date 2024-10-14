import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  shopId: ObjectId;

  @IsObjectId()
  @ToObjectId()
  @IsNotEmpty()
  productId: ObjectId;

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
