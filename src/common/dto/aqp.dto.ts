import {
	IsArray,
	IsNumber,
	IsObject,
	IsOptional,
	Max,
	Min,
} from "class-validator";
import { PopulateOptions } from "mongoose";

export class AqpDto {
	@IsOptional()
	filter?: any;

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(50)
	page?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(200)
	limit?: number = 20;

	@IsOptional()
	@IsObject()
	sort?: string | string[] | { [key: string]: number };

	@IsOptional()
	projection?: { [key: string]: number };

	@IsOptional()
	@IsArray()
	populate?: string | string[] | PopulateOptions | PopulateOptions[];

	[key: string]: any;
}
