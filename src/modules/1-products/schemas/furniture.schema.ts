import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
@Schema({
	timestamps: true,
	versionKey: false,
	collection: "products",
})
export class Furniture {
	@Prop({ type: String, required: true })
	readonly color: string;

	@Prop({ type: String, required: true })
	readonly brand: string;

	@Prop({ type: String, required: true })
	readonly material: string;
}

export type FurnitureDocument = Furniture & HydratedDocument<Furniture>;
export const FurnitureSchema = SchemaFactory.createForClass(Furniture);
