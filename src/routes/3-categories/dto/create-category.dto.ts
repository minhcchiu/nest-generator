import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
	@ApiProperty({
		example: "thumbnail-url",
		description: "URL of the category thumbnail",
	})
	@IsNotEmpty()
	@IsString()
	thumbnail: string;

	@ApiProperty({
		example: "Category Name",
		description: "Name of the category",
	})
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({ example: 1, description: "Position of the category" })
	@IsNotEmpty()
	@IsNumber()
	position: number;

	@ApiProperty({
		example: "10",
		description: "Number of stores in the category",
	})
	@IsNotEmpty()
	@IsString()
	countStores: string;

	@ApiProperty({
		example: false,
		description: 'Flag indicating if the category is "Other"',
	})
	@IsBoolean()
	isOther: boolean;

	@ApiProperty({
		example: true,
		description: "Flag indicating if the category is active",
	})
	@IsBoolean()
	isActive: boolean;
}
