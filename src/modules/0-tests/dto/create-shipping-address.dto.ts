import { Type } from "class-transformer";
import {
	IsBoolean,
	IsMongoId,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";
import { Types } from "mongoose";
import { LocationDto } from "~dto/location.dto";

export default class CreateShippingAddressDto {
	@IsOptional()
	@IsMongoId()
	provinceId?: Types.ObjectId;

	@IsOptional()
	@IsMongoId()
	districtId?: Types.ObjectId;

	@IsOptional()
	@IsMongoId()
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
