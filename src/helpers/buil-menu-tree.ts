const menuItems = [
	{
		id: 10,
		title: "Menu 10",
		level: 2,
		position: 1,
		parentId: 6,
	},
	{
		id: 1,
		title: "Menu 1",
		level: 1,
		position: 1,
	},
	{
		parentId: 1,
		id: 2,
		title: "Menu 2",
		level: 2,
		position: 1,
	},
	{
		parentId: 1,
		id: 3,
		title: "Menu 3",
		level: 2,
		position: 2,
	},
	{
		parentId: 2,
		id: 4,
		title: "Menu 4",
		level: 3,
		position: 1,
	},
	{
		parentId: 2,
		id: 5,
		title: "Menu 5",
		level: 3,
		position: 2,
	},
	{
		title: "Menu 6",
		id: 6,
		level: 1,
		position: 2,
	},
	{
		title: "Menu 7",
		id: 7,
		level: 1,
		position: 3,
	},
	{
		title: "Menu 8",
		id: 8,
		level: 1,
		position: 1,
	},
	{
		id: 9,
		title: "Menu 9",
		level: 2,
		position: 1,
		parentId: 6,
	},
];

const buildMenuTree = (menuItems) => {
	const menuMap = {};
	const rootMenus = [];

	// Build a map of menus by their IDs
	menuItems.forEach((menu) => {
		menu.children = [];
		menuMap[menu.id] = menu;
	});

	// Populate the children array of each menu
	menuItems.forEach((menu) => {
		if (menu.parentId) {
			menuMap[menu.parentId].children.push(menu);
		} else {
			rootMenus.push(menu);
		}
	});

	// Sort children arrays by position
	const sortChildren = (menu) => {
		menu.children.sort((a, b) => a.position - b.position);
		menu.children.forEach(sortChildren);
	};

	rootMenus.sort((a, b) => a.position - b.position);
	rootMenus.forEach(sortChildren);

	return rootMenus;
};

const menusWithChildren = buildMenuTree(menuItems);

console.log(menusWithChildren);
