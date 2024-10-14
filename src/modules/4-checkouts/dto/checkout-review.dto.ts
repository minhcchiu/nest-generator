import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CheckoutReviewDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly userId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly carId: ObjectId;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ShopOrderDto)
  shopOrders: ShopOrderDto[];
}

export class ShopOrderDiscountDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  shopId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  discountId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  code: string;
}

export class ShopOrderItemDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  productId: ObjectId;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class ShopOrderDto {
  shopId: ObjectId;
  shopDiscounts: ShopOrderDiscountDto[];
  items: ShopOrderItemDto[];
}
