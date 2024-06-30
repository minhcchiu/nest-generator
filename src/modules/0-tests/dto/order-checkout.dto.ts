import { IsNotEmpty, IsNumber } from "class-validator";

export class OrderCheckoutDto {
	@IsNotEmpty()
	@IsNumber()
	totalProductPrice: number;

	@IsNotEmpty()
	@IsNumber()
	totalDiscount: number;

	@IsNotEmpty()
	@IsNumber()
	shippingCost: number;

	@IsNotEmpty()
	@IsNumber()
	totalPayment: number;

	@IsNotEmpty()
	@IsNumber()
	coinsUsed: number;

	@IsNotEmpty()
	@IsNumber()
	amountByCoins: number;

	@IsNotEmpty()
	@IsNumber()
	totalProductNormalPrice: number;

	@IsNotEmpty()
	@IsNumber()
	totalProductNormalQuantity: number;

	@IsNotEmpty()
	@IsNumber()
	productStandPrice: number;

	@IsNotEmpty()
	@IsNumber()
	productStandMass: number;
}
