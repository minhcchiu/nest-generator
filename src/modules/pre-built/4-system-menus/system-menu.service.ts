import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FlattenMaps, Model, Types } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { SystemMenu } from "./schemas/system-menu.schema";

@Injectable()
export class SystemMenuService extends BaseService<SystemMenu> {
	constructor(@InjectModel(SystemMenu.name) model: Model<SystemMenu>) {
		super(model);
	}

	formatMenus(
		systemMenus: (FlattenMaps<SystemMenu> & { _id: Types.ObjectId })[],
	) {
		const rootMenus = systemMenus.filter((systemMenu) => !systemMenu.parentId);

		this._addChildrenToRoot(systemMenus, rootMenus);

		return rootMenus;
	}

	private _addChildrenToRoot(
		systemMenus: (FlattenMaps<SystemMenu> & { _id: Types.ObjectId })[],
		rootMenus: (FlattenMaps<SystemMenu> & { _id: Types.ObjectId })[],
	) {
		for (const item of rootMenus) {
			const children = this._getChildrenByParentId(systemMenus, item._id);
			Object.assign(item, { children });

			if (children.length > 0) {
				this._addChildrenToRoot(systemMenus, children);
			}
		}
	}

	private _getChildrenByParentId(
		systemMenus: (FlattenMaps<SystemMenu> & { _id: Types.ObjectId })[],
		parentId: Types.ObjectId,
	) {
		return systemMenus.filter(
			(systemMenu) => systemMenu.parentId?.toString() === parentId.toString(),
		);
	}
}
