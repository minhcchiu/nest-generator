import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { CartState } from "~modules/3-carts/enums/cart-state.enum";
import { User } from "~pre-built/1-users/schemas/user.schema";
import { CartProductDto } from "../dto/cart-product.dto";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "carts",
})
export class Cart {
	@Prop({ type: SchemaTypes.ObjectId, ref: User.name })
	userId: Types.ObjectId;

	@Prop({ type: String, enum: CartState, default: CartState.Active })
	state: string;

	@Prop({
		type: [
			{
				productId: {
					type: SchemaTypes.ObjectId,
					ref: "Product",
					required: true,
				},
				shopId: { type: SchemaTypes.ObjectId, ref: "Shop", required: true },
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
