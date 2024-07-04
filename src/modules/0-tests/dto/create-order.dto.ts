import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";
import { PaymentMethodEnum } from "../enums/payment-method.enum";
import { ProductClassificationEnum } from "../enums/product-classification.enum";
import { ShippingTypeEnum } from "../enums/shipping-type.enum";
import { CreateTestDto } from "./create-test.dto";
import { OrderCheckoutDto } from "./order-checkout.dto";
import { OrderContactDto } from "./order-contact.dto";
import { OrderProductDto } from "./order-product.dto";
import { OrderShippingAddressDto } from "./order-shipping-address.dto";
import { PickTimesDto } from "./pickup-times.dto";

export class CreateOrderDto extends PartialType(CreateTestDto) {
	@IsNotEmpty()
	@IsObjectId()
	@ToObjectId()
	storeId: string;

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => OrderProductDto)
	products: OrderProductDto[];

	@IsNotEmpty()
	@IsEnum(ProductClassificationEnum)
	productClassification: ProductClassificationEnum;

	@IsOptional()
	@ValidateNested()
	@Type(() => OrderShippingAddressDto)
	shippingAddress?: OrderShippingAddressDto;

	@IsNotEmpty()
	@IsEnum(ShippingTypeEnum)
	shippingType: ShippingTypeEnum;

	@IsOptional()
	@ValidateNested()
	@Type(() => OrderContactDto)
	contact?: OrderContactDto;

	@IsOptional()
	@ValidateNested()
	@Type(() => PickTimesDto)
	pickupTimes?: PickTimesDto;

	@IsOptional()
	@IsString()
	note?: string;

	@IsOptional()
	@IsNumber()
	coins?: number;

	@IsOptional()
	@IsObjectId()
	@ToObjectId()
	discountId?: string;

	@IsOptional()
	@IsString()
	@IsEnum(PaymentMethodEnum)
	paymentMethod?: PaymentMethodEnum;

	@IsOptional()
	@ValidateNested()
	@Type(() => OrderCheckoutDto)
	checkout: OrderCheckoutDto;
}
