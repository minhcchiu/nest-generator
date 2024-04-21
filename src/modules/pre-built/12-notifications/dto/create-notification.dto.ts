import {
	IsBoolean,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
} from "class-validator";
import { NotificationType } from "../enums/noti-type.enum";
import { TargetType } from "../enums/target-type.enum";

export class CreateNotificationDto {
	@IsNotEmpty()
	@IsMongoId()
	senderId: string;

	@IsNotEmpty()
	@IsMongoId()
	recipientId: string;

	@IsObject()
	@IsNotEmpty()
	body: Record<string, any>;

	@IsOptional()
	@IsBoolean()
	isRead?: boolean;

	@IsNotEmpty()
	@IsEnum(NotificationType)
	type: NotificationType;

	@IsNotEmpty()
	@IsEnum(TargetType)
	targetType: TargetType;

	@IsOptional()
	@IsString()
	entityType: string;

	@IsOptional()
	@IsMongoId()
	entityId: string;

	@IsNotEmpty()
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	description: string;

	@IsOptional()
	@IsString()
	thumbnail: string;

	@IsOptional()
	@IsObject()
	options: Record<string, any>;
}
