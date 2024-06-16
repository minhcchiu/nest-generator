import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "menugroups",
})
export class MenuGroup {
	@Prop({ type: SchemaTypes.ObjectId, ref: "User", required: true })
	readonly createdBy: string;

	@Prop({ type: String, required: true })
	readonly name: string;

	@Prop({ type: String })
	readonly description?: string;
}

export type MenuGroupDocument = HydratedDocument<MenuGroup>;
export const MenuGroupSchema = SchemaFactory.createForClass(MenuGroup);
