import mongoose, { HydratedDocument } from "mongoose";
import {
	User,
	UserDocument,
} from "~routes/pre-built/1-users/schemas/user.schema";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { NotificationTypeEnum } from "../enums/noti-type.enum";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "notifications",
})
export class Notification {
	@Prop({ type: String, ref: User.name, required: true })
	senderId: string | UserDocument;

	@Prop({ type: String, ref: User.name })
	recipientId: string | UserDocument;

	@Prop({ type: mongoose.Schema.Types.Mixed, required: true })
	body: Record<string, any>;

	@Prop({ type: Boolean, default: false })
	isRead: boolean;

	@Prop({ type: String, enum: NotificationTypeEnum, required: true })
	type: NotificationTypeEnum;
}

export type NotificationDocument = Notification &
	HydratedDocument<Notification>;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
