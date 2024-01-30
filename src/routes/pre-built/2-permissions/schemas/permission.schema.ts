import { HydratedDocument } from "mongoose";
import { Role } from "~routes/pre-built/1-users/enums/role.enum";
import { Endpoint } from "~routes/pre-built/2-endpoints/schemas/endpoint.schema";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "permissions",
})
export class Permission {
	@Prop({ type: String, required: true, index: true, unique: true })
	readonly prefix: string;

	@Prop({ type: String, default: "" })
	readonly name: string;

	@Prop({
		type: [{ type: String, ref: Endpoint.name }],
		default: [],
	})
	readonly endpoints: string[];

	@Prop({ type: String, default: "" })
	readonly description: string;

	@Prop({ type: [{ type: String, enum: Role }], default: [Role.SUPER_ADMIN] })
	readonly roles: Role[];

	@Prop({ type: Number, default: 0 })
	readonly position: number;
}

type PermissionDocument = HydratedDocument<Permission>;
const PermissionSchema = SchemaFactory.createForClass(Permission);

export { PermissionDocument, PermissionSchema };
