import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { LocationDto } from "~dto/location.dto";
@Schema({
	timestamps: true,
	versionKey: false,
	collection: "shops",
})
export class Shop {
	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: String, required: true })
	description: string;

	@Prop({
		type: {
			type: String,
			coordinates: [Number],
		},
	})
	location: LocationDto;
	@Prop({ type: String, required: true })
	contactInfo: string;
}

export type ShopDocument = Shop & HydratedDocument<Shop>;
export const ShopSchema = SchemaFactory.createForClass(Shop);
