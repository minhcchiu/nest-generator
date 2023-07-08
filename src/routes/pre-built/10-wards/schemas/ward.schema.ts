import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "wards",
})
export class Ward {
	@Prop({
		type: String,
		ref: "Province",
		required: true,
	})
	readonly idProvince: string;

	@Prop({
		type: String,
		ref: "District",
	})
	readonly idDistrict: string;

	@Prop({ type: String, required: true })
	readonly name: string;

	@Prop({ type: String, default: "ward" })
	readonly type: string;

	@Prop({ type: String, slug: "name" })
	readonly slug: string;
}

export type WardDocument = Ward & Document;
export const WardSchema = SchemaFactory.createForClass(Ward);
