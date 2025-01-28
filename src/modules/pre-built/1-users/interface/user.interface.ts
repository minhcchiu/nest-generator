import { ObjectId } from "mongodb";
import { AccountTypeEnum } from "../enums/account-type.enum";
import { GenderEnum } from "../enums/gender.enum";

export interface IUser {
  userGroupIds?: ObjectId[];
  roleIds: ObjectId[];
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
