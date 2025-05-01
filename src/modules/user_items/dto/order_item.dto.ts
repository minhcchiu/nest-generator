import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class OrderItemsDto {
  @IsNotEmpty()
  @IsObjectId()
  provinceId: ObjectId;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountValue: number;
}
