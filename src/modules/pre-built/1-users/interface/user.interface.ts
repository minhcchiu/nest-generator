import { GenderEnum } from "../enums/gender.enum";
import { RoleEnum } from "../enums/role.enum";
export interface IUser {
	password: string;
	email: string;
	socialID: string;
	phone?: string;
	fullName: string;
	gender?: GenderEnum;
	dateOfBirth?: number;
	roles: RoleEnum[];
}
