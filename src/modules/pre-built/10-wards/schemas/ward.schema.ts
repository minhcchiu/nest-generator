import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Province } from "~pre-built/8-provinces/schemas/province.schema";
import { District } from "~pre-built/9-districts/schemas/district.schema";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "wards",
})
export class Ward {
	@Prop({
		type: SchemaTypes.ObjectId,
		ref: Province.name,
		required: true,
	})
	readonly provinceId: Types.ObjectId;

	@Prop({
		type: SchemaTypes.ObjectId,
		ref: District.name,
	})
	readonly districtId: Types.ObjectId;

	@Prop({ type: String, required: true })
	readonly name: string;

	@Prop({ type: String, required: true })
	readonly nameEn: string;

	@Prop({ type: String, required: true })
	readonly fullName: string;

	@Prop({ type: String, required: true })
	readonly fullNameEn: string;

	@Prop({ type: String, required: true, unique: true })
	readonly codeName: string;

	@Prop({ type: Number, required: true })
	readonly position: number;

	@Prop({ type: String })
	readonly administrativeUnit?: string;

	@Prop({ type: String })
	readonly administrativeUnitEn?: string;
}

export type WardDocument = Ward & HydratedDocument<Ward>;
export const WardSchema = SchemaFactory.createForClass(Ward);
