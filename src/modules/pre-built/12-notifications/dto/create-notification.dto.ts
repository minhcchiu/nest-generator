import {
	IsBoolean,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

import { NotificationType } from "../enums/noti-type.enum";
import { TargetType } from "../enums/target-type.enum";

export class CreateNotificationDto {
	@ApiProperty({ description: "ID of the sender" })
	@IsNotEmpty()
	@IsMongoId()
	senderId: string;

	@ApiProperty({ description: "ID of the recipient" })
	@IsNotEmpty()
	@IsMongoId()
	recipientId: string;

	@ApiProperty({ description: "Body of the notification" })
	@IsObject()
	@IsNotEmpty()
	body: Record<string, any>;

	@ApiProperty({
		required: false,
		description: "Read status of the notification",
	})
	@IsOptional()
	@IsBoolean()
	isRead?: boolean;

	@ApiProperty({ description: "Type of the notification" })
	@IsNotEmpty()
	@IsEnum(NotificationType)
	type: NotificationType;

	@ApiProperty({ description: "Target type of the notification" })
	@IsNotEmpty()
	@IsEnum(TargetType)
	targetType: TargetType;

	@ApiProperty({ required: false, description: "Type of the entity" })
	@IsOptional()
	@IsString()
	entityType: string;

	@ApiProperty({ required: false, description: "ID of the entity" })
	@IsOptional()
	@IsMongoId()
	entityId: string;

	@ApiProperty({ description: "Title of the notification" })
	@IsNotEmpty()
	@IsString()
	title: string;

	@ApiProperty({
		required: false,
		description: "Description of the notification",
	})
	@IsOptional()
	@IsString()
	description: string;

	@ApiProperty({
		required: false,
		description: "Thumbnail URL of the notification",
	})
	@IsOptional()
	@IsString()
	thumbnail: string;

	@ApiProperty({
		required: false,
		description: "Additional options for the notification",
	})
	@IsOptional()
	@IsObject()
	options: Record<string, any>;
}
