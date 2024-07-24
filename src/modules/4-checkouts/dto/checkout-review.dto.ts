import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { Types } from "mongoose";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CheckoutReviewDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly userId: Types.ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly carId: Types.ObjectId;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ShopOrderDto)
  shopOrders: ShopOrderDto[];
}

export class ShopOrderDiscountDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  shopId: Types.ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  discountId: Types.ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  code: string;
}

export class ShopOrderItemDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  productId: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class ShopOrderDto {
  shopId: Types.ObjectId;
  shopDiscounts: ShopOrderDiscountDto[];
  items: ShopOrderItemDto[];
}
