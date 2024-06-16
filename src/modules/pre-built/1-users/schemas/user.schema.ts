import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { UserGroup } from "~modules/pre-built/2-user-groups/schemas/user-group.schema";
import { MenuGroup } from "~modules/pre-built/4-menu-groups/schemas/menu-group.schema";
import { AccountStatus } from "../enums/account-status.enum";
import { AccountTypeEnum } from "../enums/account-type.enum";
import { GenderEnum } from "../enums/gender.enum";
import { RoleEnum } from "../enums/role.enum";
import { IUser } from "../interface/user.interface";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "users",
})
export class User implements IUser {
	@Prop({
		type: [{ type: String, enum: RoleEnum }],
		default: [RoleEnum.User],
	})
	roles: RoleEnum[];

	@Prop({
		type: [{ type: SchemaTypes.ObjectId, ref: UserGroup.name }],
	})
	userGroupIds?: Types.ObjectId[];

	@Prop({
		type: SchemaTypes.ObjectId,
		ref: MenuGroup.name,
	})
	menuGroupId?: Types.ObjectId;

	@Prop({ type: String })
	username?: string;

	@Prop({ type: String })
	email?: string;

	@Prop({ type: String })
	phone?: string;

	@Prop({ type: String, select: false })
	socialID?: string;

	@Prop({ type: String, enum: AccountTypeEnum, default: AccountTypeEnum.Local })
	accountType: AccountTypeEnum;

	@Prop({ type: String, minlength: 6, required: true, select: false })
	password: string;

	@Prop({ type: String, required: true })
	fullName: string;

	@Prop({ type: Date })
	dateBirth?: Date;

	@Prop({ type: String, enum: GenderEnum })
	gender?: GenderEnum;

	@Prop({ type: String, default: "" })
	avatar?: string;

	@Prop({ type: [String] })
	fcmTokens?: string[];

	@Prop({ type: Boolean, default: true })
	fmcEnabled: boolean;

	@Prop({
		type: String,
		enum: AccountStatus,
		default: AccountStatus.Unverified,
	})
	status: AccountStatus;
}

type UserDocument = HydratedDocument<User>;
const UserSchema = SchemaFactory.createForClass(User);

export { UserDocument, UserSchema };
