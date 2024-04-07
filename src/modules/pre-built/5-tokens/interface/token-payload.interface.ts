import { AccountStatus } from "~pre-built/1-users/enums/account-status.enum";
import { AccountType } from "~pre-built/1-users/enums/account-type.enum";
import { GenderEnum } from "~pre-built/1-users/enums/gender.enum";
import { RoleEnum } from "~pre-built/1-users/enums/role.enum";

export interface TokenPayload {
	readonly _id: string;
	readonly roles: RoleEnum[];
	readonly email?: string;
	readonly phone?: string;
	readonly fullName: string;
	readonly avatar?: string;
	readonly gender?: GenderEnum;
	readonly dateOfBirth?: number;
	readonly status?: AccountStatus;
	readonly accountType?: AccountType;
	readonly storeId?: string;
}
