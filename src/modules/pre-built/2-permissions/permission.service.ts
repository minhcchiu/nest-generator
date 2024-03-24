import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Permission } from "./schemas/permission.schema";

@Injectable()
export class PermissionService extends BaseService<Permission> {
	constructor(@InjectModel(Permission.name) model: PaginateModel<Permission>) {
		super(model);
	}
}
