import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { ResourceTypeEnum } from "~modules/pre-built/7-uploads/enum/resource-type.enum";
import { StorageLocationEnum } from "~pre-built/7-uploads/enum/store-location.enum";
import { UploadType } from "~types/upload-type";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "userfiles",
})
export class UserFile {
	@Prop({ type: SchemaTypes.ObjectId, ref: "User", required: true })
	userId: Types.ObjectId;

	@Prop({ type: [String], required: true })
	resourceKeys: string[];

	@Prop({ type: String, required: true })
	fileName: string;

	@Prop({ type: String, required: true })
	fileType: UploadType;

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

	@Prop({ type: String, default: "" })
	fileFolder: string;

	@Prop({ type: Number, default: "" })
	fileSize: number;

	@Prop({ type: String, default: "" })
	originalname: string;
}

export type UserFileDocument = UserFile & HydratedDocument<UserFile>;
export const UserFileSchema = SchemaFactory.createForClass(UserFile);
