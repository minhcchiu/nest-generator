import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsNumber,
	IsString,
} from "class-validator";
import { LocationTypeEnum } from "~dto/location.dto";

import { ApiProperty } from "@nestjs/swagger";

export class LocationDto {
	@IsString()
	@ApiProperty({ example: "Point", description: "Type of location" })
	@IsEnum(LocationTypeEnum)
	type: LocationTypeEnum;

	@ApiProperty({
		example: [0, 0],
		description: "Geographical coordinates [longitude, latitude]",
	})
	@IsArray()
	@IsNumber({}, { each: true })
	@ArrayMinSize(2, { message: "Coordinates must have at least 2 elements" })
	@ArrayMaxSize(2, { message: "Coordinates must have at most 2 elements" })
	coordinates: number[];
}
