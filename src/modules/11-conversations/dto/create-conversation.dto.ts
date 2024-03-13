import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateConversationDto {
	@ApiProperty({
		example: "thumbnail-url",
		description: "URL of the conversation thumbnail",
	})
	@IsNotEmpty()
	@IsString()
	thumbnail: string;

	@ApiProperty({
		example: "Conversation Name",
		description: "Name of the conversation",
	})
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({ example: 1, description: "Position of the conversation" })
	@IsNotEmpty()
	@IsNumber()
	position: number;

	@ApiProperty({
		example: "10",
		description: "Number of stores in the conversation",
	})
	@IsNotEmpty()
	@IsString()
	countStores: string;

	@ApiProperty({
		example: false,
		description: 'Flag indicating if the conversation is "Other"',
	})
	@IsBoolean()
	isOther: boolean;

	@ApiProperty({
		example: true,
		description: "Flag indicating if the conversation is active",
	})
	@IsBoolean()
	isActive: boolean;
}
