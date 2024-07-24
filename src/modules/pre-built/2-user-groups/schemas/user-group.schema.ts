import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "usergroups",
})
export class UserGroup {
  @Prop({ type: String, required: true, unique: true })
  readonly name: string;

  @Prop({ type: String })
  readonly description?: string;

  @Prop({ type: Number })
  readonly position?: number;
}

type UserGroupDocument = HydratedDocument<UserGroup>;
const UserGroupSchema = SchemaFactory.createForClass(UserGroup);

export { UserGroupDocument, UserGroupSchema };
