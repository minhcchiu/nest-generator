import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Product } from "~routes/1-products/schemas/product.schema";
import { Shop } from "~routes/1-shops/schemas/shop.schema";
import { Cart } from "~routes/3-carts/schemas/cart.schema";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "inventories",
})
export class Inventory {
	@Prop({ type: String, ref: Shop.name })
	shopId: string;

	@Prop({ type: String, ref: Product.name })
	productId: string;

	@Prop({ type: String, default: "unknown" })
	location: string;

	@Prop({ type: Number, required: true })
	stock: number;

	@Prop({
		type: [
			{
				quantity: Number,
				cartId: { type: String, ref: Cart.name },
				createdAt: Date,
			},
		],
		default: [],
	})
	reservations: {
		quantity: number;
		cartId: string;
		createdAt: Date;
	}[];
}

export type InventoryDocument = Inventory & HydratedDocument<Inventory>;
export const InventorySchema = SchemaFactory.createForClass(Inventory);
