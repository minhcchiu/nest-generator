import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Province } from "~routes/pre-built/8-provinces/schemas/province.schema";
import { District } from "~routes/pre-built/9-districts/schemas/district.schema";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "settings",
})
export class Setting {
	@Prop({
		type: String,
		ref: Province.name,
		required: true,
	})
	readonly provinceId: string;

	@Prop({
		type: String,
		ref: District.name,
	})
	readonly districtId: string;

	@Prop({ type: String, required: true })
	readonly name: string;

	@Prop({ type: String, default: "setting" })
	readonly type: string;

	@Prop({ type: String, slug: "name" })
	readonly slug: string;
}

export type SettingDocument = Setting & HydratedDocument<Setting>;
export const SettingSchema = SchemaFactory.createForClass(Setting);
