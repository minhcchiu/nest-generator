import { Type } from "class-transformer";
import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { LocationDto } from "~dto/location.dto";
import { NullableType } from "~types/nullable.type";
import { OpenCloseTimeDto } from "./open-close-time.dto";

export class CreateStoreDto {
	@IsNotEmpty()
	@IsString()
	userId: string;

	@IsOptional()
	@IsString()
	coverImage: NullableType<string>;

	@IsNotEmpty()
	@IsString()
	thumbnail: NullableType<string>;

	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	phone: string;

	@IsOptional()
	@IsString()
	description: NullableType<string>;

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => OpenCloseTimeDto)
	openCloseTimes: OpenCloseTimeDto[];

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => LocationDto)
	location: LocationDto;

	@IsOptional()
	@IsString()
	provinceId: NullableType<string>;

	@IsOptional()
	@IsString()
	districtId: NullableType<string>;

	@IsOptional()
	@IsString()
	wardId: NullableType<string>;

	@IsOptional()
	@IsString()
	street: NullableType<string>;

	@IsNumber()
	totalRatings: number;

	@IsNumber()
	countReviews: number;

	@IsNumber()
	countSales: number;
}
