import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "categories",
})
export class Discount {
	@Prop({ type: SchemaTypes.ObjectId, required: true })
	storeId: Types.ObjectId;

	@Prop({ type: String, required: true })
	code: string;

	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: String, default: "" })
	description: string;

	@Prop({ type: String, default: null })
	discountType;

	@Prop({ type: String, default: null })
	discountValue;

	@Prop({ type: String, default: null })
	maxDiscountValue;

	@Prop({ type: String, default: null })
	startAt;

	@Prop({ type: String, default: null })
	endAt;

	@Prop({ type: String, default: null })
	maxUses;

	@Prop({ type: String, default: null })
	MaxUses;

	@Prop({ type: String, default: null })
	UsedCount;

	@Prop({ type: String, default: null })
	MaxUsesPerUser;

	@Prop({ type: String, default: null })
	MinOrderValue;

	@Prop({ type: String, default: null })
	isActive: boolean;

	@Prop({ type: String, default: null })
	applyTo;

	@Prop({ type: String, default: null })
	productIds;

	@Prop({ type: String, default: null })
	usersUsed;
}

export type DiscountDocument = Discount & HydratedDocument<Discount>;
export const DiscountSchema = SchemaFactory.createForClass(Discount);
