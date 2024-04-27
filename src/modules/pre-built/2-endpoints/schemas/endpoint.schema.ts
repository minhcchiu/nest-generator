import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { RoleEnum } from "~pre-built/1-users/enums/role.enum";
import { HttpMethod } from "../enum/http-method";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "endpoints",
})
export class Endpoint {
	@Prop({ type: String, default: "#" })
	readonly collectionName: string;

	@Prop({ type: String, default: "" })
	readonly name: string;

	@Prop({ type: String, default: "" })
	readonly path: string;

	@Prop({ type: String, enum: HttpMethod, default: HttpMethod.GET })
	readonly method: HttpMethod;

	@Prop({ type: String, default: "" })
	readonly description?: string;

	@Prop({
		type: [{ type: String, enum: RoleEnum }],
		default: [RoleEnum.SupperAdmin, RoleEnum.User],
	})
	readonly userRoles: RoleEnum[];

	@Prop({ type: Boolean, default: false })
	readonly isPublic: boolean;
}

type EndpointDocument = HydratedDocument<Endpoint>;
const EndpointSchema = SchemaFactory.createForClass(Endpoint);
EndpointSchema.index({ path: 1, method: 1 }, { unique: true });
export { EndpointDocument, EndpointSchema };
