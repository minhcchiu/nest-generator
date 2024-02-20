import { HydratedDocument } from "mongoose";
import { NullableType } from "~utils/types/nullable.type";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { SatisfiedOptionDto } from "../dto/satisfied-option.dto";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "reviews",
})
export class Review {
	@Prop({ type: String, ref: "User", required: true })
	userId: string;

	@Prop({ type: String, ref: "Order", default: null })
	orderId: NullableType<string>;

	@Prop({ type: String, ref: "Store", required: true })
	storeId: string;

	@Prop({ type: String, ref: "Product", default: null })
	productId: NullableType<string>;

	@Prop({ type: Number, required: true })
	rating: number;

	@Prop({ type: [String], default: [] })
	images: string[];

	@Prop({
		type: { url: String, thumb: String },
		default: null,
	})
	videos: NullableType<{ url: string; thumb: string }>;

	@Prop({ type: String, default: "" })
	comment: string;

	@Prop({ type: Boolean, default: false })
	isHasMedia: boolean;

	@Prop({
		type: [
			{
				name: String,
				key: String,
				thumbnail: String,
			},
		],
		default: [],
	})
	satisfiedOptions: SatisfiedOptionDto[];
}

export type ReviewDocument = Review & HydratedDocument<Review>;
export const ReviewSchema = SchemaFactory.createForClass(Review);
