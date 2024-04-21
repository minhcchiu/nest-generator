import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsNumber,
	IsString,
} from "class-validator";
import { LocationTypeEnum } from "~dto/location.dto";

export class LocationDto {
	@IsString()
	@IsEnum(LocationTypeEnum)
	type: LocationTypeEnum;

	@IsArray()
	@IsNumber({}, { each: true })
	@ArrayMinSize(2, { message: "Coordinates must have at least 2 elements" })
	@ArrayMaxSize(2, { message: "Coordinates must have at most 2 elements" })
	coordinates: number[];
}
