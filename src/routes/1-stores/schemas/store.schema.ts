import { HydratedDocument } from "mongoose";
import { LocationDto } from "~dto/location.dto";
import { Ward } from "~routes/pre-built/10-wards/schemas/ward.schema";
import { Province } from "~routes/pre-built/8-provinces/schemas/province.schema";
import { District } from "~routes/pre-built/9-districts/schemas/district.schema";
import { NullableType } from "~utils/types/nullable.type";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { OpenCloseTimeDto } from "../dto/open-close-time.dto";
import { LocationTypeEnum } from "../enums/location-type.enum";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "stores",
})
export class Store {
	@Prop({ type: String, ref: "User", unique: true })
	userId: string;

	@Prop({ type: String, default: "" })
	coverImage: string;

	@Prop({ type: String, required: true })
	thumbnail: string;

	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: String, required: true })
	phone: string;

	@Prop({ type: String, default: "" })
	description: string;

	@Prop({
		type: [
			{
				dayOfWeek: Number,
				openTime: String,
				closeTime: String,
				note: String,
				isOff: Boolean,
			},
		],
		default: [],
	})
	openCloseTimes: OpenCloseTimeDto[];

	@Prop({
		type: {
			type: String,
			enum: LocationTypeEnum,
			default: LocationTypeEnum.Point,
		},
		coordinates: {
			type: [Number],
			default: [0, 0],
		},
	})
	location: LocationDto;

	@Prop({ type: String, ref: Province.name, default: null })
	provinceId: NullableType<string>;

	@Prop({ type: String, ref: District.name, default: null })
	districtId: NullableType<string>;

	@Prop({ type: String, ref: Ward.name, default: null })
	wardId: NullableType<string>;

	@Prop({ type: String, default: "" })
	street: string;

	@Prop({ type: Number, default: 0 })
	totalRatings: number;

	@Prop({ type: Number, default: 0 })
	countReviews: number;

	@Prop({ type: Number, default: 0 })
	countSales: number;
}

export type StoreDocument = Store & HydratedDocument<Store>;
export const StoreSchema = SchemaFactory.createForClass(Store);
