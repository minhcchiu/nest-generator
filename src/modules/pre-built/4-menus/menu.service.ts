import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FlattenMaps, Model, Types } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Menu } from "./schemas/menu.schema";
@Injectable()
export class MenuService extends BaseService<Menu> {
	constructor(@InjectModel(Menu.name) model: Model<Menu>) {
		super(model);
	}

	formatMenus(menus: (FlattenMaps<Menu> & { _id: Types.ObjectId })[]) {
		const rootMenus = menus.filter((menu) => !menu.parentId);

		this._addChildrenToRoot(menus, rootMenus);

		return rootMenus;
	}

	private _addChildrenToRoot(
		menus: (FlattenMaps<Menu> & { _id: Types.ObjectId })[],
		rootMenus: (FlattenMaps<Menu> & { _id: Types.ObjectId })[],
	) {
		for (const item of rootMenus) {
			const children = this._getChildrenByParentId(menus, item._id.toString());
			Object.assign(item, { children });

			if (children.length > 0) {
				this._addChildrenToRoot(menus, children);
			}
		}
	}

	private _getChildrenByParentId(
		menus: (FlattenMaps<Menu> & { _id: Types.ObjectId })[],
		parentId: string,
	) {
		return menus.filter((menu) => menu.parentId?.toString() === parentId);
	}
}
