import { hash } from "argon2";
import { HydratedDocument } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { AccountStatus } from "../enums/account-status.enum";
import { AccountType } from "../enums/account-type.enum";
import { Gender } from "../enums/gender.enum";
import { Role } from "../enums/role.enum";
import { IUser } from "../interface/user.interface";

type UserDocument = HydratedDocument<User>;

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "users",
})
export class User implements IUser {
	@Prop({ type: String })
	username: string;

	@Prop({ type: String })
	email: string;

	@Prop({ type: String })
	phone: string;

	@Prop({ type: String, select: false })
	socialID: string;

	@Prop({ type: String, enum: AccountType, default: AccountType.LOCAL })
	accountType: AccountType;

	@Prop({ type: String, minlength: 6, select: false })
	password: string;

	@Prop({ type: String, required: true })
	fullName: string;

	@Prop({ type: String, slug: "fullName", index: true, unique: true })
	slug: string;

	@Prop({ type: [String] })
	fcmTokens?: string[];

	@Prop({ type: Number })
	dateOfBirth?: number;

	@Prop({ type: String, enum: Gender, default: Gender.OTHER })
	gender: Gender;

	@Prop({ type: String, enum: Role, default: Role.USER })
	role: Role;

	@Prop({ type: Boolean, default: false })
	deleted: boolean;

	@Prop({ type: String })
	avatar?: string;

	@Prop({ type: String, enum: AccountStatus, default: AccountStatus.INACTIVE })
	status: AccountStatus;
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
