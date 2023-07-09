import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ProductType } from "../enums/product-type.enum";
import mongoose from "mongoose";
import { User } from "~routes/pre-built/1-users/schemas/user.schema";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "products",
})
export class Product {
	@Prop({ type: String, required: true })
	readonly name: string;

	@Prop({ type: String, required: true })
	readonly thumbnail: string;

	@Prop({ type: String, default: null })
	readonly desc: string;

	@Prop({ type: Number, required: true })
	readonly price: number;

	@Prop({ type: Number, required: true })
	readonly quantity: number;

	@Prop({ type: String, required: true, enum: ProductType })
	readonly type: ProductType;

	@Prop({ type: String, ref: User.name })
	readonly user: string;

	@Prop({ type: mongoose.Schema.Types.Mixed, ref: "Shop" })
	readonly attributes: string;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
