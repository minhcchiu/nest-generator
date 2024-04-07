import { RoleEnum } from "~modules/pre-built/1-users/enums/role.enum";

export type EndpointPermissionType = {
	userRoles: RoleEnum[];
	isPublic: boolean;
};
