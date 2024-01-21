import { HydratedDocument } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "clothes",
})
export class Clothing {
	@Prop({ type: String, required: true })
	readonly manufacture: string;

	@Prop({ type: String, required: true })
	readonly model: string;

	@Prop({ type: String, required: true })
	readonly color: string;
}

export type ClothingDocument = Clothing & HydratedDocument<Clothing>;
export const ClothingSchema = SchemaFactory.createForClass(Clothing);
