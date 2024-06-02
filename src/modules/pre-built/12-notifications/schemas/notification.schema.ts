import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { User } from "~pre-built/1-users/schemas/user.schema";
import { NotificationType } from "../enums/noti-type.enum";
import { TargetType } from "../enums/target-type.enum";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "notifications",
})
export class Notification {
	@Prop({ type: String, enum: TargetType, required: true })
	targetType: TargetType;

	@Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
	senderId: Types.ObjectId;

	@Prop({ type: SchemaTypes.ObjectId, ref: User.name })
	recipientId: Types.ObjectId;

	@Prop({ type: String, enum: NotificationType, required: true })
	notificationType: NotificationType;

	@Prop({ type: String })
	entityType: string;

	@Prop({ type: SchemaTypes.ObjectId })
	entityId: Types.ObjectId;

	@Prop({ type: String, required: true })
	title: string;

	@Prop({ type: String, default: "" })
	description: string;

	@Prop({ type: String })
	thumbnail?: string;

	@Prop({ type: mongoose.Schema.Types.Mixed })
	options?: Record<string, any>;

	@Prop({ type: Boolean, default: false })
	isRead: boolean;
}

export type NotificationDocument = Notification &
	HydratedDocument<Notification>;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
