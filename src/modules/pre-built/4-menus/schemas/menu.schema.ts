import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { SystemMenu } from "~modules/pre-built/4-system-menus/schemas/system-menu.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "menus",
})
export class Menu {
  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: Menu.name }], default: [] })
  readonly menuGroupIds?: ObjectId[];

  @Prop({ type: SchemaTypes.ObjectId, ref: Menu.name })
  readonly parentId?: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: SystemMenu.name })
  readonly systemMenuId?: ObjectId;

  @Prop({ type: String })
  readonly name?: string;

  @Prop({ type: Number })
  readonly sortOrder?: number;

  @Prop({ type: Boolean, default: false })
  readonly isHorizontal: boolean;

  @Prop({ type: Boolean, default: true })
  readonly isShow: boolean;
}

export type MenuDocument = HydratedDocument<Menu>;
export const MenuSchema = SchemaFactory.createForClass(Menu);
