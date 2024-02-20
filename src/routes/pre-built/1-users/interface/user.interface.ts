import { GenderEnum } from "../enums/gender.enum";
import { Role } from "../enums/role.enum";

export interface IUser {
	password: string;
	email: string;
	socialID: string;
	phone?: string;
	fullName: string;
	gender?: GenderEnum;
	dateOfBirth?: number;
	roles: Role[];
	slug: string;
}
