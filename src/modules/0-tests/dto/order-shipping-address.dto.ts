import { PartialType } from "@nestjs/mapped-types";
import { IsOptional, IsString } from "class-validator";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";
import CreateShippingAddressDto from "./create-shipping-address.dto";

export class OrderShippingAddressDto extends PartialType(
	CreateShippingAddressDto,
) {
	@IsOptional()
	@IsObjectId()
	@ToObjectId()
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
