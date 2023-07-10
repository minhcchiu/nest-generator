import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Province } from "~routes/pre-built/8-provinces/schemas/province.schema";
import { District } from "~routes/pre-built/9-districts/schemas/district.schema";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "wards",
})
export class Ward {
	@Prop({
		type: String,
		ref: Province.name,
		required: true,
	})
	readonly idProvince: string;

	@Prop({
		type: String,
		ref: District.name,
	})
	readonly idDistrict: string;

	@Prop({ type: String, required: true })
	readonly name: string;

	@Prop({ type: String, default: "ward" })
	readonly type: string;

	@Prop({ type: String, slug: "name" })
	readonly slug: string;
}

export type WardDocument = Ward & HydratedDocument<Ward>;
export const WardSchema = SchemaFactory.createForClass(Ward);
