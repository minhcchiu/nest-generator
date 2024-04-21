import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
@Schema({
	timestamps: true,
	versionKey: false,
	collection: "provinces",
})
export class Province {
	@Prop({ type: String, required: true })
	readonly name: string;
}

export type ProvinceDocument = Province & HydratedDocument<Province>;
export const ProvinceSchema = SchemaFactory.createForClass(Province);
