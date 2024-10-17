import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CheckoutReviewDto {
  @IsNotEmpty()
  @IsObjectId()
  readonly userId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  readonly carId: ObjectId;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ShopOrderDto)
  shopOrders: ShopOrderDto[];
}

export class ShopOrderDiscountDto {
  @IsNotEmpty()
  @IsObjectId()
  shopId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  discountId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  code: string;
}

export class ShopOrderItemDto {
  @IsNotEmpty()
  @IsObjectId()
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
