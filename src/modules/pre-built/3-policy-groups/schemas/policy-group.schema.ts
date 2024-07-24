import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { User } from "~modules/pre-built/1-users/schemas/user.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "policygroups",
})
export class PolicyGroup {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  readonly createdBy: Types.ObjectId;

  @Prop({ type: String, unique: true, required: true })
  readonly name: string;

  @Prop({ type: String })
  readonly description?: string;
}

type PolicyGroupDocument = HydratedDocument<PolicyGroup>;
const PolicyGroupSchema = SchemaFactory.createForClass(PolicyGroup);

export { PolicyGroupDocument, PolicyGroupSchema };
