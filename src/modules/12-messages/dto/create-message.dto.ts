import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto {
	@ApiProperty({
		example: "thumbnail-url",
		description: "URL of the message thumbnail",
	})
	@IsNotEmpty()
	@IsString()
	thumbnail: string;

	@ApiProperty({
		example: "Message Name",
		description: "Name of the message",
	})
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({ example: 1, description: "Position of the message" })
	@IsNotEmpty()
	@IsNumber()
	position: number;

	@ApiProperty({
		example: "10",
		description: "Number of stores in the message",
	})
	@IsNotEmpty()
	@IsString()
	countStores: string;

	@ApiProperty({
		example: false,
		description: 'Flag indicating if the message is "Other"',
	})
	@IsBoolean()
	isOther: boolean;

	@ApiProperty({
		example: true,
		description: "Flag indicating if the message is active",
	})
	@IsBoolean()
	isActive: boolean;
}
