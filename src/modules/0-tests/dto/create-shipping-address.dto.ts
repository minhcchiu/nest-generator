import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";
import { LocationDto } from "~dto/location.dto";

export default class CreateShippingAddressDto {
	@IsOptional()
	@IsObjectId()
	@ToObjectId()
	provinceId?: Types.ObjectId;

	@IsOptional()
	@IsObjectId()
	@ToObjectId()
	districtId?: Types.ObjectId;

	@IsOptional()
	@IsObjectId()
	@ToObjectId()
	wardId?: Types.ObjectId;

	@IsOptional()
	@IsString()
	street?: string;

	@IsOptional()
	@IsString()
	other?: string;

	@IsOptional()
	@IsBoolean()
	isDefault: boolean;

	@IsNotEmpty()
	@Type(() => LocationDto)
	location: LocationDto;
}
