import { HydratedDocument } from "mongoose";
import { StorageLocationEnum } from "~pre-built/7-uploads/enum/store-location.enum";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UploadType } from "~types/upload-type";

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

	@Prop({ type: [String], default: [] })
	resourceIds: string[];

	@Prop({ type: String, required: true })
	fileName: string;

	@Prop({ type: String, required: true })
	fileType: string;

	@Prop({ type: String, required: true })
	uploadType: UploadType;

	@Prop({ type: String, default: "" })
	fileOriginal: string;

	@Prop({ type: String, default: "" })
	fileXs: string;

	@Prop({ type: String, default: "" })
	fileSm: string;

	@Prop({ type: String, default: "" })
	fileMd: string;

	@Prop({ type: String, default: "" })
	fileLg: string;

	@Prop({ type: Number, required: true })
	fileSize: number;

	@Prop({ type: Date, required: true })
	uploadedAt: Date;

	@Prop({ type: String, required: true })
	fileFolder: string;

	@Prop({ type: String, enum: StorageLocationEnum, required: true })
	storageLocation: StorageLocationEnum;
}

export type UserFileDocument = UserFile & HydratedDocument<UserFile>;
export const UserFileSchema = SchemaFactory.createForClass(UserFile);
