import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "inventories",
})
export class Inventory {
	@Prop({ type: String, ref: "Shop" })
	shopId: string;

	@Prop({ type: String, ref: "Product" })
	productId: string;

	@Prop({ type: String, default: "unknown" })
	location: string;

	@Prop({ type: Number, required: true })
	stock: number;

	@Prop({ type: [String], default: [] })
	reservations: string[];
}

export type InventoryDocument = Inventory & HydratedDocument<Inventory>;
export const InventorySchema = SchemaFactory.createForClass(Inventory);
