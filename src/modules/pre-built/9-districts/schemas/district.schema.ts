import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Province } from "~pre-built/8-provinces/schemas/province.schema";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "districts",
})
export class District {
	@Prop({
		type: String,
		ref: Province.name,
		required: true,
	})
	readonly provinceId: Types.ObjectId;

	@Prop({ type: String, required: true })
	readonly name: string;
}

export type DistrictDocument = District & HydratedDocument<District>;
export const DistrictSchema = SchemaFactory.createForClass(District);
