import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Province } from "~routes/pre-built/8-provinces/schemas/province.schema";

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
	readonly idProvince: string;

	@Prop({ type: String, required: true })
	readonly name: string;

	@Prop({ type: String, default: "district" })
	readonly type: string;

	@Prop({ type: String, slug: "name" })
	readonly slug: string;
}

export type DistrictDocument = District & Document;
export const DistrictSchema = SchemaFactory.createForClass(District);
