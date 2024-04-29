import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { UserGroup } from "./schemas/user-group.schema";
@Injectable()
export class UserGroupService extends BaseService<UserGroup> {
	constructor(@InjectModel(UserGroup.name) model: PaginateModel<UserGroup>) {
		super(model);
	}
}
