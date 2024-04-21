import { IsMongoId, IsOptional } from "class-validator";
import { OrderStatusEnum } from "../enums/order-status.enum";

export class CreateOrderDto {
	@IsMongoId()
	readonly userId: string;

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
