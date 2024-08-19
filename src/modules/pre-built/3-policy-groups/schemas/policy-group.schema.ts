import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "policy-groups",
})
export class PolicyGroup {
  @Prop({ type: String, unique: true, required: true })
  readonly name: string;

  @Prop({ type: String, unique: true, required: true })
  readonly collectionName: string;

  @Prop({ type: String })
  readonly description?: string;
}

type PolicyGroupDocument = HydratedDocument<PolicyGroup>;
const PolicyGroupSchema = SchemaFactory.createForClass(PolicyGroup);

export { PolicyGroupDocument, PolicyGroupSchema };
