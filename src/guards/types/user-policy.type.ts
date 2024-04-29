import { RoleEnum } from "~modules/pre-built/1-users/enums/role.enum";

export type UserPolicyType = {
	userGroupIds: string[];
	userRoles: RoleEnum[];
	isPublic: boolean;
};
