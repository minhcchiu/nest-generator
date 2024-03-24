import { HydratedDocument } from "mongoose";
import { Store } from "~modules/1-stores/schemas/store.schema";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "productgroups",
})
export class ProductGroup {
	@Prop({ type: String, ref: Store.name, required: true })
	storeId: string;

	@Prop({ type: String, required: true })
	thumbnail: string;

	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: Number, required: true })
	position: number;

	@Prop({ type: String, default: "" })
	description: string;
}

export type ProductGroupDocument = ProductGroup &
	HydratedDocument<ProductGroup>;
export const ProductGroupSchema = SchemaFactory.createForClass(ProductGroup);
