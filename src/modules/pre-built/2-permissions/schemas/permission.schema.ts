import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { RoleEnum } from "~modules/pre-built/1-users/enums/role.enum";
import { Endpoint } from "~pre-built/2-endpoints/schemas/endpoint.schema";
@Schema({
	timestamps: true,
	versionKey: false,
	collection: "permissions",
})
export class Permission {
	@Prop({ type: String, required: true, index: true, unique: true })
	readonly collectionName: string;

	@Prop({ type: String, default: "" })
	readonly name: string;

	@Prop({
		type: [{ type: String, ref: Endpoint.name }],
		default: [],
	})
	readonly endpoints: string[];
	@Prop({ type: String, default: "" })
	readonly description: string;

	@Prop({
		type: [{ type: String, enum: RoleEnum }],
		default: [RoleEnum.SupperAdmin],
	})
	readonly roles: RoleEnum[];
	@Prop({ type: Number, default: 0 })
	readonly position: number;
}

type PermissionDocument = HydratedDocument<Permission>;
const PermissionSchema = SchemaFactory.createForClass(Permission);
export { PermissionDocument, PermissionSchema };
