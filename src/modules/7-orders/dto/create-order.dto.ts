import { IsNotEmpty, IsOptional } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";
import { OrderStatusEnum } from "../enums/order-status.enum";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly userId: ObjectId;

  @IsOptional()
  readonly checkout: {
    totalPrice: number;
    totalApplyDiscount: number;
    feeShip: number;
  };

  @IsOptional()
  shipping: {
    street: string;
    province: string;
    state: string;
    country: string;
  };

  @IsOptional()
  readonly payment: any;

  @IsOptional()
  products: any[];

  @IsOptional()
  trackingNumber: string;

  @IsOptional()
  status: OrderStatusEnum;
}
