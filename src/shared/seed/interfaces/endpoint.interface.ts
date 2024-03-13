import { Role } from "~pre-built/1-users/enums/role.enum";
import { HttpMethod } from "~pre-built/2-endpoints/enum/http-method";

export interface IEndpoint {
	prefix: string;
	name: string;
	path: string;
	method: HttpMethod;
	description?: string;
	userRoles?: Role[];
	isPublic?: boolean;
}
