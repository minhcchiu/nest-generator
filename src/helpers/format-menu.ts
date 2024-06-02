import { Types } from "mongoose";

type MenuType = {
	_id: Types.ObjectId;
	parentId?: Types.ObjectId;
	menuId?: Record<string, any>; // use for user menu
	[key: string]: any;
};

export const formatMenus = (menus: MenuType[]) => {
	const rootMenus = menus.filter((menu) => !menu.parentId);

	addChildrenToRoot(
		rootMenus,
		menus.filter((menu) => menu.parentId),
	);

	return sortMenus(rootMenus);
};

function addChildrenToRoot(rootMenus: MenuType[], submenus: MenuType[]) {
	for (const root of rootMenus) {
		const children = getChildrenByParentId(submenus, root._id);

		Object.assign(root, { children });

		if (children.length > 0) {
			addChildrenToRoot(
				children,
				submenus.filter((item) => item.parentId),
			);
		}
	}
}

function getChildrenByParentId(submenus: MenuType[], parentId: Types.ObjectId) {
	const menus = submenus.filter(
		(item) => item.parentId?.toString() === parentId.toString(),
	);

	return sortMenus(menus);
}

function sortMenus(menus: MenuType[]) {
	menus.sort(
		(a, b) =>
			(a.menuId?.position || a.position) - (b.menuId?.position || b.position),
	);

	return menus;
}
