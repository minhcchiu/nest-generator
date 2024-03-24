import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
	@ApiProperty({
		example: "thumbnail-url",
		description: "URL of the order thumbnail",
	})
	@IsNotEmpty()
	@IsString()
	thumbnail: string;

	@ApiProperty({
		example: "Order Name",
		description: "Name of the order",
	})
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({ example: 1, description: "Position of the order" })
	@IsNotEmpty()
	@IsNumber()
	position: number;

	@ApiProperty({
		example: "10",
		description: "Number of stores in the order",
	})
	@IsNotEmpty()
	@IsString()
	countStores: string;

	@ApiProperty({
		example: false,
		description: 'Flag indicating if the order is "Other"',
	})
	@IsBoolean()
	isOther: boolean;

	@ApiProperty({
		example: true,
		description: "Flag indicating if the order is active",
	})
	@IsBoolean()
	isActive: boolean;
}
