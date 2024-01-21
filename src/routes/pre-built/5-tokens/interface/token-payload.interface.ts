import { Role } from "~pre-built/1-users/enums/role.enum";
import { AccountStatus } from "~routes/pre-built/1-users/enums/account-status.enum";
import { AccountType } from "~routes/pre-built/1-users/enums/account-type.enum";
import { GenderEnum } from "~routes/pre-built/1-users/enums/gender.enum";

export interface TokenPayload {
	readonly _id: string;
	readonly roles: Role[];
	readonly email?: string;
	readonly phone?: string;
	readonly fullName: string;
	readonly avatar?: string;
	readonly gender?: GenderEnum;
	readonly dateOfBirth?: number;
	readonly status?: AccountStatus;
	readonly accountType?: AccountType;
}
