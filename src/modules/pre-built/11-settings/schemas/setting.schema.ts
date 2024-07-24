import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "settings",
})
export class Setting {
  @Prop({ type: String })
  logoUrl?: string;

  @Prop({ type: String })
  appName?: string;

  @Prop({ type: String })
  termsOfUse?: string;

  @Prop({ type: String })
  privacyPolicy?: string;
}

export type SettingDocument = Setting & HydratedDocument<Setting>;
export const SettingSchema = SchemaFactory.createForClass(Setting);
