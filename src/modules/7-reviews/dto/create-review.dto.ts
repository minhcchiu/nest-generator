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

import { ApiProperty } from "@nestjs/swagger";

import { SatisfiedOptionDto } from "./satisfied-option.dto";

export class CreateReviewDto {
	@ApiProperty({ description: "ID of the user who created the review" })
	@IsNotEmpty()
	@IsMongoId()
	userId: string;

	@ApiProperty({ description: "ID of the associated order (optional)" })
	@IsOptional()
	@IsMongoId()
	orderId?: string;

	@ApiProperty({ description: "ID of the store where the review is created" })
	@IsNotEmpty()
	@IsMongoId()
	storeId: string;

	@ApiProperty({ description: "ID of the associated product (optional)" })
	@IsOptional()
	@IsMongoId()
	productId?: string;

	@ApiProperty({ description: "Rating given in the review" })
	@IsNotEmpty()
	@Min(1)
	@Max(5)
	@IsNumber()
	rating: number;

	@ApiProperty({ description: "Array of image URLs (optional)" })
	@IsOptional()
	@IsString({ each: true })
	images?: string[];

	@ApiProperty({
		description:
			"Array of video objects containing URL and thumbnail (optional)",
	})
	@IsOptional()
	@IsUrl({})
	videos?: string;

	@ApiProperty({ description: "Comment provided in the review (optional)" })
	@IsOptional()
	@IsString()
	comment?: string;

	@ApiProperty({
		description: "Flag indicating whether the review has media (optional)",
	})
	@IsOptional()
	@IsBoolean()
	isHasMedia?: boolean;

	@ApiProperty({
		description: "Array of satisfied options provided in the review (optional)",
	})
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => SatisfiedOptionDto)
	satisfiedOptions?: SatisfiedOptionDto[];
}
