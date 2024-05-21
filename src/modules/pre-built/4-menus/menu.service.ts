import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Menu } from "./schemas/menu.schema";
@Injectable()
export class MenuService extends BaseService<Menu> {
	constructor(@InjectModel(Menu.name) model: Model<Menu>) {
		super(model);
	}
}
