import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Shop } from "~modules/1-shops/schemas/shop.schema";
import { DiscountAppliesToEnum } from "../enums/discount-applies-to.enum";
import { DiscountTypeEnum } from "../enums/discount-type.enum";
@Schema({
	timestamps: true,
	versionKey: false,
	collection: "discounts",
})
export class Discount {
	@Prop({ type: String, ref: Shop.name })
	shopId: string;

	@Prop({ type: String, required: true })
	code: string;

	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: String, required: true })
	description: string;

	@Prop({
		type: String,
		enum: DiscountTypeEnum,
		default: DiscountTypeEnum.fixedAmount,
	})
	discountType: DiscountTypeEnum;
	@Prop({ type: Number, required: true }) // 10.000 , 10
	discountValue: number;
	@Prop({ type: Date, required: true })
	startDate: Date;
	@Prop({ type: Date, required: true })
	endDate: Date;
	@Prop({ type: Number, required: true }) // số lượng discount được áp dụng
	maxUses: number;
	@Prop({ type: Number, required: true }) // số lượng discount đã sử dụng
	usesCount: number;
	@Prop({ type: [{ type: String, ref: "User" }], default: [] }) // danh sách user đang sử dụng
	usersUsed: string[];
	@Prop({ type: Number, required: true }) // Số lượng tối đa cho mỗi user
	maxUsersPerUser: number;
	@Prop({ type: Number, required: true })
	minOrderValue: number;
	@Prop({ type: Boolean, default: true })
	isActive: boolean;
	@Prop({ type: String, enum: DiscountAppliesToEnum, required: true })
	appliesTo: DiscountAppliesToEnum;
	@Prop({
		type: [{ type: String, ref: "Product" }],
		default: [],
	})
	productIds: string[];
}

export type DiscountDocument = Discount & HydratedDocument<Discount>;
export const DiscountSchema = SchemaFactory.createForClass(Discount);
