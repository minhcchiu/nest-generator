import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { UserGroup } from "~modules/pre-built/2-user-groups/schemas/user-group.schema";
import { RoleEnum } from "~pre-built/1-users/enums/role.enum";
import { HttpMethod } from "../enum/http-method";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "policies",
})
export class Policy {
	@Prop({ type: String })
	readonly policyKey: string;

	@Prop({ type: String, unique: true, required: true })
	readonly name: string;

	@Prop({ type: String, default: "#" })
	readonly collectionName: string;

	@Prop({ type: String, required: true })
	readonly endpoint: string;

	@Prop({ type: String, enum: HttpMethod, required: true })
	readonly method: HttpMethod;

	@Prop({ type: String })
	readonly description?: string;

	@Prop({
		type: [{ type: String, enum: RoleEnum }],
		default: [RoleEnum.SupperAdmin],
	})
	readonly userRoles: RoleEnum[];

	@Prop({
		type: [{ type: SchemaTypes.ObjectId, ref: UserGroup.name }],
		default: [],
	})
	userGroupIds: Types.ObjectId[] = [];

	@Prop({ type: Boolean, default: false })
	readonly isPublic: boolean;
}

type PolicyDocument = HydratedDocument<Policy>;
const PolicySchema = SchemaFactory.createForClass(Policy);

PolicySchema.index({ endpoint: 1, method: 1 }, { unique: true });

export { PolicyDocument, PolicySchema };
