import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { AppTypeEnum } from "../enums/app-type.enum";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "banners",
})
export class Banner {
	@Prop({ type: String, required: true })
	imageUrl: string;

	@Prop({ type: String, required: true })
	title: string;

	@Prop({ type: String, default: "" })
	link: string;

	@Prop({ type: Number, default: 0 })
	startAt: number; // milliseconds

	@Prop({ type: Number, default: 0 })
	endAt: number;

	@Prop({ type: Number, unique: true, required: true })
	position: number;

	@Prop({ type: Boolean, default: true })
	isActive: boolean;

	@Prop({ type: String, enum: AppTypeEnum, default: AppTypeEnum.Customer })
	appType: AppTypeEnum;
}

export type BannerDocument = Banner & HydratedDocument<Banner>;
export const BannerSchema = SchemaFactory.createForClass(Banner);
