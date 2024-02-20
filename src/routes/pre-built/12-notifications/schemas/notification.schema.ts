import mongoose, { HydratedDocument } from "mongoose";
import {
	User,
	UserDocument,
} from "~routes/pre-built/1-users/schemas/user.schema";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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

	@Prop({ type: String, ref: User.name, required: true })
	senderId: string | UserDocument;

	@Prop({ type: String, ref: User.name })
	recipientId: string | UserDocument;

	@Prop({ type: String, enum: NotificationType, required: true })
	type: NotificationType;

	@Prop({ type: String })
	entityType: string;

	@Prop({ type: String })
	entityId: string;

	@Prop({ type: String, required: true })
	title: string;

	@Prop({ type: String, default: "" })
	description: string;

	@Prop({ type: String, default: "" })
	thumbnail: string;

	@Prop({ type: mongoose.Schema.Types.Mixed, required: true })
	options: Record<string, any>;

	@Prop({ type: Boolean, default: false })
	isRead: boolean;
}

export type NotificationDocument = Notification &
	HydratedDocument<Notification>;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
