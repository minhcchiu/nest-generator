import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
} from "class-validator";

export enum LocationTypeEnum {
	Point = "Point",
}

export class LocationDto {
	@IsNotEmpty()
	@IsEnum(LocationTypeEnum)
	type: LocationTypeEnum;

	@IsNotEmpty()
	@IsArray()
	@ArrayMinSize(2)
	@ArrayMaxSize(2)
	@IsNumber({}, { each: true })
	coordinates: number[];
}
