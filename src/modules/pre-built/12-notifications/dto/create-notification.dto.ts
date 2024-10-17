import { IsBoolean, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";
import { NotificationType } from "../enums/noti-type.enum";
import { TargetType } from "../enums/target-type.enum";

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsObjectId()
  senderId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  recipientId: ObjectId;

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
  @IsObjectId()
  entityId: ObjectId;

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
