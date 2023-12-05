import {
	IsBoolean,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsObject,
	IsOptional,
} from "class-validator";
import { NotificationTypeEnum } from "../enums/noti-type.enum";

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
	@IsEnum(NotificationTypeEnum)
	type: NotificationTypeEnum;
}
