import { RoleEnum } from "~pre-built/1-users/enums/role.enum";

export interface IPermission {
	collectionName: string;
	name: string;
	endpoints?: string[];
	description?: string;
	roles?: RoleEnum[];
	position: number;
}
