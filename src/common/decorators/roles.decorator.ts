import { SetMetadata } from "@nestjs/common";
import { RoleEnum } from "~pre-built/1-users/enums/role.enum";

export const ROLES_KEY = "roles";

export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
