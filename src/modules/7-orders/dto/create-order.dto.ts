import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";
import { OrderStatusEnum } from "../enums/order-status.enum";

export class CreateOrderDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly userId: Types.ObjectId;

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
