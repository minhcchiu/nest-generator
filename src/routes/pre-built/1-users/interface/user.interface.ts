import { Gender } from "../enums/gender.enum";
import { Role } from "../enums/role.enum";

export interface IUser {
	password: string;
	email: string;
	socialToken: string;
	phone?: string;
	fullName: string;
	gender: Gender;
	dateOfBirth: number;
	role: Role;
}
