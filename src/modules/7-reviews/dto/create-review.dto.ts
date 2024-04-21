import { Type } from "class-transformer";
import {
	IsBoolean,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUrl,
	Max,
	Min,
	ValidateNested,
} from "class-validator";
import { SatisfiedOptionDto } from "./satisfied-option.dto";

export class CreateReviewDto {
	@IsNotEmpty()
	@IsMongoId()
	userId: string;

	@IsOptional()
	@IsMongoId()
	orderId?: string;

	@IsNotEmpty()
	@IsMongoId()
	storeId: string;

	@IsOptional()
	@IsMongoId()
	productId?: string;

	@IsNotEmpty()
	@Min(1)
	@Max(5)
	@IsNumber()
	rating: number;

	@IsOptional()
	@IsString({ each: true })
	images?: string[];

	@IsOptional()
	@IsUrl({})
	videos?: string;

	@IsOptional()
	@IsString()
	comment?: string;

	@IsOptional()
	@IsBoolean()
	isHasMedia?: boolean;

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => SatisfiedOptionDto)
	satisfiedOptions?: SatisfiedOptionDto[];
}
