import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Menu } from "./schemas/menu.schema";

@Injectable()
export class MenuService extends BaseService<Menu> {
	constructor(@InjectModel(Menu.name) model: PaginateModel<Menu>) {
		super(model);
	}
}
