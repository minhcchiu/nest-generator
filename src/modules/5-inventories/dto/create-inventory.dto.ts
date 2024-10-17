import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsObjectId()
  shopId: ObjectId;

  @IsObjectId()
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
