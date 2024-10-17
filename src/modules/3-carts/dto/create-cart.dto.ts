import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";
import { CartProductDto } from "./cart-product.dto";

export class CreateCartDto {
  @IsNotEmpty()
  @IsObjectId()
  readonly userId: ObjectId;

  @IsOptional()
  @ValidateNested()
  @Type(() => CartProductDto)
  readonly products: CartProductDto[];
}
