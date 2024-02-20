import { HydratedDocument } from "mongoose";
import { Store } from "~routes/1-stores/schemas/store.schema";
import { User } from "~routes/pre-built/1-users/schemas/user.schema";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "news",
})
export class News {
	@Prop({ type: String, ref: User.name, required: true })
	userId: string;

	@Prop({ type: String, ref: Store.name, required: true })
	storeId: string;

	@Prop({ type: String, required: true })
	title: string;

	@Prop({ type: String, required: true })
	thumbnail: string;

	@Prop({ type: String, required: true })
	content: string;

	@Prop({ type: Number, default: 0 })
	countViews: number;
}

export type NewsDocument = News & HydratedDocument<News>;
export const NewsSchema = SchemaFactory.createForClass(News);
