import { Role } from "~pre-built/1-users/enums/role.enum";
import { AccountStatus } from "~routes/pre-built/1-users/enums/account-status.enum";
import { Gender } from "~routes/pre-built/1-users/enums/gender.enum";

export interface TokenPayload {
	readonly _id: string;
	readonly role: Role;
	readonly email?: string;
	readonly phone?: string;
	readonly fullName: string;
	readonly avatar?: string;
	readonly gender?: Gender;
	readonly dateOfBirth?: number;
	readonly deleted?: boolean;
	readonly status?: AccountStatus;
}
