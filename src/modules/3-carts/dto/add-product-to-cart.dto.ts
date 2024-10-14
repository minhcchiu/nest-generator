import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";
import { CartProductDto } from "./cart-product.dto";

export class AddProductToCartDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly userId: ObjectId;

  @IsNotEmpty()
  @Type(() => CartProductDto)
  readonly product: CartProductDto;
}
