import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { cartState } from "~routes/3-carts/enums/cart-state.enum";
import { CartProductDto } from "../dto/cart-product.dto";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "carts",
})
export class Cart {
	@Prop({ type: String, ref: "User" })
	userId: string;

	@Prop({ type: String, enum: cartState, default: cartState.active })
	readonly state: string;

	@Prop({
		type: [
			{
				productId: { type: String, ref: "Product", required: true },
				shopId: { type: String, ref: "Shop", required: true },
				quantity: { type: Number, default: 1 },
				name: { type: String, required: true },
				price: { type: Number, required: true },
			},
		],
		default: [],
	})
	products: CartProductDto[];
}

export type CartDocument = Cart & HydratedDocument<Cart>;
export const CartSchema = SchemaFactory.createForClass(Cart);
