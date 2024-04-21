import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Store } from "~modules/1-stores/schemas/store.schema";
import { ProductGroup } from "~modules/5-product-groups/schemas/product-group.schema";
import { UnitPriceEnum } from "../enums/unit-price.enum";
@Schema({
	timestamps: true,
	versionKey: false,
	collection: "products",
})
export class Product {
	@Prop({ type: String, ref: Store.name, required: true })
	storeId: string;

	@Prop({ type: String, ref: ProductGroup.name, required: true })
	productGroupId: string;

	@Prop({ type: String, required: true })
	thumbnail: string;

	@Prop({ type: String, required: true })
	title: string;

	@Prop({ type: Number, required: true })
	price: number;
	@Prop({ type: String, enum: UnitPriceEnum, default: UnitPriceEnum.VND })
	unitPrice: UnitPriceEnum;
	@Prop({ type: String, required: true })
	description: string;
}

export type ProductDocument = Product & HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
