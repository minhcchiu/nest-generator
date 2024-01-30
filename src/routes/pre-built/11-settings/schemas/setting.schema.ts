import { HydratedDocument } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "settings",
})
export class Setting {
	@Prop({ type: String, default: "" })
	logoUrl: string;

	@Prop({ type: String, default: "" })
	appName: string;

	@Prop({ type: String, default: "" })
	termsOfUse: string;

	@Prop({ type: String, default: "" })
	privacyPolicy: string;
}

export type SettingDocument = Setting & HydratedDocument<Setting>;
export const SettingSchema = SchemaFactory.createForClass(Setting);
