import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { MenuGroup } from "./schemas/menu-group.schema";

@Injectable()
export class MenuGroupService extends BaseService<MenuGroup> {
	constructor(@InjectModel(MenuGroup.name) model: Model<MenuGroup>) {
		super(model);
	}
}
