import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "roles",
})
export class Role {
  @Prop({ type: String, required: true, unique: true, uppercase: true })
  readonly name: string;

  @Prop({ type: String })
  readonly description?: string;

  @Prop({ type: Number })
  readonly position?: number;
}

type RoleDocument = HydratedDocument<Role>;
const RoleSchema = SchemaFactory.createForClass(Role);

export { RoleDocument, RoleSchema };
