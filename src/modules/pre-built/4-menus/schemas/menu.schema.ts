import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { RoleEnum } from "~pre-built/1-users/enums/role.enum";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "menus",
})
export class Menu {
	@Prop({ type: SchemaTypes.ObjectId, ref: Menu.name, default: null })
	readonly parentId?: Types.ObjectId;

	@Prop({ type: Boolean, default: false })
	readonly isGroup: boolean;

	@Prop({ type: String, default: "" })
	readonly name: string;

	@Prop({ type: String, default: "" })
	readonly collectionName: string;

	@Prop({ type: String, default: "" })
	readonly icon: string;

	@Prop({ type: String, default: "" })
	readonly href: string;

	@Prop({ type: Number, default: 0 })
	readonly position: number;

	@Prop({ type: Boolean, default: false })
	readonly isHorizontal: boolean;

	@Prop({ type: Boolean, default: true })
	readonly isShow: boolean;

	@Prop({
		type: [{ type: String, enum: RoleEnum }],
		default: [RoleEnum.SupperAdmin],
	})
	readonly roles: RoleEnum[];
}

export type MenuDocument = HydratedDocument<Menu>;
export const MenuSchema = SchemaFactory.createForClass(Menu);
