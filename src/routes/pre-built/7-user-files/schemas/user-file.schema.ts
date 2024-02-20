import { HydratedDocument } from "mongoose";
import { StorageLocationEnum } from "~routes/pre-built/7-uploads/enum/store-location.enum";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { FileType } from "~utils/types/file.type";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "userfiles",
})
export class UserFile {
	@Prop({ type: String, ref: "User", required: true })
	userId: string;

	@Prop({ type: String, required: true, unique: true })
	resourceId: string;

	@Prop({ type: String, required: true })
	fileName: string;

	@Prop({ type: String, required: true })
	fileType: FileType;

	@Prop({ type: String, required: true, unique: true, index: true })
	url: string;

	@Prop({ type: Number, required: true })
	fileSize: number;

	@Prop({ type: Number, required: true })
	uploadedAt: number;

	@Prop({ type: String, required: true })
	fileFolder: string;

	@Prop({ type: String, enum: StorageLocationEnum, required: true })
	storageLocation: StorageLocationEnum;
}

export type UserFileDocument = UserFile & HydratedDocument<UserFile>;
export const UserFileSchema = SchemaFactory.createForClass(UserFile);
