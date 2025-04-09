import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "systemmenus",
})
export class SystemMenu {
  @Prop({ type: SchemaTypes.ObjectId, ref: SystemMenu.name })
  readonly parentId?: ObjectId;

  @Prop({ type: String, required: true, unique: true })
  readonly name: string;

  @Prop({ type: Boolean, default: false })
  readonly isGroup: boolean;

  @Prop({ type: String })
  readonly icon?: string;

  @Prop({ type: String })
  readonly href?: string;

  @Prop({ type: Number, default: 0 })
  readonly sortOrder: number;

  @Prop({ type: Boolean, default: false })
  readonly isHorizontal: boolean;

  @Prop({ type: Boolean, default: true })
  readonly isShow: boolean;

  @Prop({ type: Boolean, default: false })
  readonly deleted: boolean;

  @Prop({ type: Boolean, default: false })
  readonly isSystem: boolean;
}

export type SystemMenuDocument = HydratedDocument<SystemMenu>;
export const SystemMenuSchema = SchemaFactory.createForClass(SystemMenu);
