import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { User } from "~modules/pre-built/1-users/schemas/user.schema";
import { Menu } from "~modules/pre-built/4-menus/schemas/menu.schema";
import { MenuCustomerDto } from "../dto/menu-custom.dto";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "menugroups",
})
export class MenuGroup {
	@Prop({ type: [{ type: SchemaTypes.ObjectId, ref: User.name }] })
	readonly userIds?: Types.ObjectId[];

	@Prop({ type: SchemaTypes.ObjectId, ref: MenuGroup.name })
	readonly parentId?: Types.ObjectId;

	@Prop({ type: String, required: true })
	readonly name: string;

	@Prop({ type: Number, default: 0 })
	readonly position: number;

	@Prop({ type: Boolean, default: false })
	readonly isHorizontal: boolean;

	@Prop({ type: Boolean, default: true })
	readonly isShow: boolean;

	@Prop({ type: String })
	readonly href?: string;

	@Prop({ type: String })
	readonly icon?: string;

	@Prop({ type: [{ type: SchemaTypes.ObjectId, ref: Menu.name }] })
	menuIds?: Types.ObjectId[];

	@Prop({
		type: [
			{
				menuId: { type: SchemaTypes.ObjectId, ref: Menu.name },
				custom: { type: SchemaTypes.Mixed },
			},
		],
	})
	menusCustom?: MenuCustomerDto[];
}

export type MenuGroupDocument = HydratedDocument<MenuGroup>;
export const MenuGroupSchema = SchemaFactory.createForClass(MenuGroup);
