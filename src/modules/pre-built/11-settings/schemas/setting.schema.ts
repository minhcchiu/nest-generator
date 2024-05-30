import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "settings",
})
export class Setting {
	@Prop({ type: String, default: "" })
	logoUrl: string;

	@Prop({ type: String, default: "" })
	serverName: string;

	@Prop({ type: String, default: "" })
	termsOfUse: string;

	@Prop({ type: String, default: "" })
	privacyPolicy: string;
}

export type SettingDocument = Setting & HydratedDocument<Setting>;
export const SettingSchema = SchemaFactory.createForClass(Setting);
