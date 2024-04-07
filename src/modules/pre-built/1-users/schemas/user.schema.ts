import { hash } from "argon2";
import { HydratedDocument } from "mongoose";
import { Store } from "~modules/1-stores/schemas/store.schema";
import { NullableType } from "~types/nullable.type";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { AccountStatus } from "../enums/account-status.enum";
import { AccountType } from "../enums/account-type.enum";
import { GenderEnum } from "../enums/gender.enum";
import { RoleEnum } from "../enums/role.enum";
import { IUser } from "../interface/user.interface";

type UserDocument = HydratedDocument<User>;

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "users",
})
export class User implements IUser {
	@Prop({ type: [String], required: true, select: false, index: true })
	authKeys: string[];

	@Prop({ type: String, default: null })
	username: NullableType<string>;

	@Prop({ type: String, default: null })
	email: NullableType<string>;

	@Prop({ type: String, default: null })
	phone: NullableType<string>;

	@Prop({ type: String, default: null, select: false })
	socialID: NullableType<string>;

	@Prop({ type: String, enum: AccountType, default: AccountType.Local })
	accountType: AccountType;

	@Prop({ type: String, minlength: 6, required: true, select: false })
	password: string;

	@Prop({ type: String, required: true })
	fullName: string;

	@Prop({ type: Number, default: 0 })
	dateOfBirth: number;

	@Prop({ type: String, enum: GenderEnum, default: GenderEnum.OTHER })
	gender: GenderEnum;

	@Prop({
		type: [
			{
				type: String,
				enum: RoleEnum,
			},
		],
		default: [RoleEnum.User, RoleEnum.SupperAdmin],
	})
	roles: RoleEnum[];

	@Prop({ type: String, default: null })
	avatar: NullableType<string>;

	@Prop({ type: [String], default: [] })
	fcmTokens: string[];

	@Prop({ type: Boolean, default: true })
	isFCMEnabled: boolean;

	@Prop({
		type: String,
		enum: AccountStatus,
		default: AccountStatus.Unverified,
	})
	status: AccountStatus;

	@Prop({ type: Boolean, default: false })
	isNotificationActive: boolean;

	@Prop({ type: String, ref: Store.name, default: null })
	storeId: NullableType<string>;

	@Prop({
		type: [{ type: String, ref: Store.name }],
		default: [],
	})
	favoriteStores: string[];
}

const UserSchema = SchemaFactory.createForClass(User);

// Pre save
UserSchema.pre("save", async function (next: any) {
	const user = this as UserDocument;

	// Only hash the password if it has been modified (or is new)
	if (!user.isModified("password")) return next();

	// Hash password
	user.password = await hash(user.password);

	return next();
});

export { UserDocument, UserSchema };
