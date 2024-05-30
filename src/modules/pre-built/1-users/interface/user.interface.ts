import { Types } from "mongoose";
import { AccountTypeEnum } from "../enums/account-type.enum";
import { GenderEnum } from "../enums/gender.enum";
import { RoleEnum } from "../enums/role.enum";

export interface IUser {
	userGroupIds: Types.ObjectId[];
	roles: RoleEnum[];
	accountType: AccountTypeEnum;
	fullName: string;
	username?: string;
	password: string;
	email?: string;
	socialID?: string;
	phone?: string;
	gender?: GenderEnum;
	dateBirth?: Date;
}
