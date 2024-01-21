import { ApiProperty } from "@nestjs/swagger";
import {
	IsString,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	ValidateNested,
} from "class-validator";
import { NullableType } from "~utils/types/nullable.type";
import { OpenCloseTimeDto } from "./open-close-time.dto";
import { LocationDto } from "~dto/location.dto";
import { Type } from "class-transformer";

export class CreateStoreDto {
	@ApiProperty({ example: "userId", description: "User ID reference" })
	@IsNotEmpty()
	@IsString()
	userId: string;

	@ApiProperty({
		example: "cover-image-url",
		description: "URL of the cover image",
		required: false,
	})
	@IsOptional()
	@IsString()
	coverImage: NullableType<string>;

	@ApiProperty({
		example: "thumbnail-url",
		description: "URL of the thumbnail image",
	})
	@IsNotEmpty()
	@IsString()
	thumbnail: NullableType<string>;

	@ApiProperty({ example: "Store Name", description: "Name of the store" })
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({ example: "123456789", description: "Contact phone number" })
	@IsNotEmpty()
	@IsString()
	phone: string;

	@ApiProperty({
		example: "Store Description",
		description: "Description of the store",
		required: false,
	})
	@IsOptional()
	@IsString()
	description: NullableType<string>;

	@ApiProperty({
		example: [
			{
				dayOfWeek: 0,
				openTime: "08:00",
				closeTime: "18:00",
				note: "",
				isOff: false,
			},
		],
		description: "Array of opening and closing times for the store",
		required: false,
	})
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => OpenCloseTimeDto)
	openCloseTimes: OpenCloseTimeDto[];

	@ApiProperty({
		example: {
			type: "Point",
			coordinates: [0, 0],
		},
		description: "Geographical coordinates of the store location",
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => LocationDto)
	location: LocationDto;

	@ApiProperty({
		example: "provinceId",
		description: "ID reference to the province",
		required: false,
	})
	@IsOptional()
	@IsString()
	provinceId: NullableType<string>;

	@ApiProperty({
		example: "districtId",
		description: "ID reference to the district",
		required: false,
	})
	@IsOptional()
	@IsString()
	districtId: NullableType<string>;

	@ApiProperty({
		example: "wardId",
		description: "ID reference to the ward",
		required: false,
	})
	@IsOptional()
	@IsString()
	wardId: NullableType<string>;

	@ApiProperty({
		example: "Street Address",
		description: "Street address of the store",
		required: false,
	})
	@IsOptional()
	@IsString()
	street: NullableType<string>;

	@ApiProperty({ example: 0, description: "Total ratings for the store" })
	@IsNumber()
	totalRatings: number;

	@ApiProperty({ example: 0, description: "Count of reviews for the store" })
	@IsNumber()
	countReviews: number;

	@ApiProperty({ example: 0, description: "Count of sales for the store" })
	@IsNumber()
	countSales: number;
}
