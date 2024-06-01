import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "menus",
})
export class Menu {
	@Prop({ type: SchemaTypes.ObjectId, ref: Menu.name })
	readonly parentId?: Types.ObjectId;

	@Prop({ type: String, required: true, unique: true })
	readonly name: string;

	@Prop({ type: String })
	readonly collectionName?: string;

	@Prop({ type: Boolean, default: false })
	readonly isGroup: boolean;

	@Prop({ type: String })
	readonly icon?: string;

	@Prop({ type: String })
	readonly href?: string;

	@Prop({ type: Number, default: 0 })
	readonly position: number;

	@Prop({ type: Boolean, default: false })
	readonly isHorizontal: boolean;

	@Prop({ type: Boolean, default: true })
	readonly isShow: boolean;

	@Prop({ type: Boolean, default: false })
	readonly deleted: boolean;

	@Prop({ type: Boolean, default: false })
	readonly isSystem: boolean;
}

export type MenuDocument = HydratedDocument<Menu>;
export const MenuSchema = SchemaFactory.createForClass(Menu);
