import { HydratedDocument } from "mongoose";
import { StorageLocationEnum } from "~pre-built/7-uploads/enum/store-location.enum";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ResourceTypeEnum } from "~modules/pre-built/7-uploads/enum/resource-type.enum";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "userfiles",
})
export class UserFile {
	@Prop({ type: String, ref: "User", required: true })
	userId: string;

	@Prop({ type: [String], required: true })
	resourceIds: string[];

	@Prop({ type: String, required: true })
	fileName: string;

	@Prop({ type: String, required: true })
	fileType: string;

	@Prop({ type: String, enum: ResourceTypeEnum, required: true })
	resourceType: ResourceTypeEnum;

	@Prop({ type: String, default: "" })
	urlXSmall: string;

	@Prop({ type: String, default: "" })
	urlSmall: string;

	@Prop({ type: String, default: "" })
	urlMedium: string;

	@Prop({ type: String, default: "" })
	urlLarge: string;

	@Prop({ type: String, default: "" })
	urlXLarge: string;

	@Prop({ type: String, required: true, index: true })
	url: string;

	@Prop({ type: String, enum: StorageLocationEnum, required: true })
	storageLocation: StorageLocationEnum;
}

export type UserFileDocument = UserFile & HydratedDocument<UserFile>;
export const UserFileSchema = SchemaFactory.createForClass(UserFile);
