import { Types } from "mongoose";
import { AccountTypeEnum } from "~modules/pre-built/1-users/enums/account-type.enum";
import { RoleEnum } from "~pre-built/1-users/enums/role.enum";

export interface TokenPayload {
	readonly _id: Types.ObjectId;
	readonly roles: RoleEnum[];
	readonly userGroupIds: Types.ObjectId[];
	readonly accountType: AccountTypeEnum;
	readonly fullName: string;
	readonly username?: string;
	readonly email?: string;
	readonly phone?: string;
	readonly socialID?: string;
}
