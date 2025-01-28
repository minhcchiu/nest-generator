import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { Role } from "~modules/pre-built/2-roles/schemas/role.schema";
import { UserGroup } from "~modules/pre-built/2-user-groups/schemas/user-group.schema";
import { Resource } from "~modules/pre-built/3-resources/schemas/resource.schema";
import { HttpMethod } from "../enum/http-method";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "policies",
})
export class Policy {
  @Prop({ type: SchemaTypes.ObjectId, ref: Resource.name })
  readonly resourceId: ObjectId;

  @Prop({ type: String, required: true, unique: true })
  readonly name: string;

  @Prop({ type: String, unique: true, required: true })
  readonly policyKey: string;

  @Prop({ type: String, required: true })
  readonly endpoint: string;

  @Prop({ type: String, enum: HttpMethod, required: true })
  readonly method: HttpMethod;

  @Prop({ type: String })
  readonly description?: string;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: UserGroup.name }],
    default: [],
  })
  userIds: ObjectId[] = [];

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: Role.name }],
    default: [],
  })
  roleIds: ObjectId[] = [];

  @Prop({ type: Boolean, default: false })
  readonly isPublic: boolean;

  @Prop({ type: Boolean, default: false })
  readonly isAuthenticated: boolean;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: UserGroup.name }],
  })
  blockedUserGroupIds?: ObjectId[];
}

type PolicyDocument = HydratedDocument<Policy>;
const PolicySchema = SchemaFactory.createForClass(Policy);

PolicySchema.index({ endpoint: 1, method: 1 }, { unique: true });

export { PolicyDocument, PolicySchema };
