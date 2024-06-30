import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId, IsOptional, IsString } from "class-validator";
import CreateShippingAddressDto from "./create-shipping-address.dto";

export class OrderShippingAddressDto extends PartialType(
	CreateShippingAddressDto,
) {
	@IsOptional()
	@IsMongoId()
	shippingAddressId: string;

	@IsOptional()
	@IsString()
	provinceName: string;

	@IsOptional()
	@IsString()
	districtName: string;

	@IsOptional()
	@IsString()
	wardName: string;
}
