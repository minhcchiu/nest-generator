import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { RoleEnum } from "~pre-built/1-users/enums/role.enum";
import { MenuLevel } from "../enum/menu-level";
@Schema({
	timestamps: true,
	versionKey: false,
	collection: "menus",
})
export class Menu {
	@Prop({ type: String, ref: Menu.name })
	readonly parentId?: string;

	@Prop({ type: String, default: "" })
	readonly name: string;

	@Prop({ type: String, default: "" })
	readonly collectionName: string;

	@Prop({ type: String, default: "" })
	readonly icon: string;

	@Prop({ type: Number, enum: MenuLevel, default: MenuLevel.ONE })
	readonly level: MenuLevel;
	@Prop({ type: String, default: "" })
	readonly url: string;

	@Prop({ type: Number, default: 0 })
	readonly position: number;
	@Prop({ type: Boolean, default: false })
	readonly isHorizontal: boolean;
	@Prop({ type: Boolean, default: true })
	readonly isActive: boolean;

	@Prop({
		type: [{ type: String, enum: RoleEnum }],
		default: [RoleEnum.SupperAdmin, RoleEnum.User],
	})
	readonly roles: RoleEnum[];
}

export type MenuDocument = HydratedDocument<Menu>;
export const MenuSchema = SchemaFactory.createForClass(Menu);
