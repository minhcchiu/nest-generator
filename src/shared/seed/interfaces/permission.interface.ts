import { Role } from "~pre-built/1-users/enums/role.enum";

export interface IPermission {
	prefix: string;
	name: string;
	endpoints?: string[];
	description?: string;
	roles?: Role[];
	position: number;
}
