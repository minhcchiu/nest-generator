import { HydratedDocument } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { BoolEnum } from "sharp";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "categories",
})
export class Category {
	@Prop({ type: String, required: true })
	thumbnail: string;

	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: Number, required: true, unique: true })
	position: number;

	@Prop({ type: String, required: true })
	countStores: string;

	@Prop({ type: Boolean, default: false })
	isOther: BoolEnum;

	@Prop({ type: Boolean, default: true })
	isActive: boolean;
}

export type CategoryDocument = Category & HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);
