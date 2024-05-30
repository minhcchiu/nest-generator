import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "policygroups",
})
export class PolicyGroup {
	@Prop({ type: String, unique: true, required: true })
	readonly name: string;

	@Prop({ type: String })
	readonly description?: string;
}

type PolicyGroupDocument = HydratedDocument<PolicyGroup>;
const PolicyGroupSchema = SchemaFactory.createForClass(PolicyGroup);

PolicyGroupSchema.index({ endpoint: 1, method: 1 }, { unique: true });

export { PolicyGroupDocument, PolicyGroupSchema };
