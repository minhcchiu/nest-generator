import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MenuController } from "./menu.controller";
import { Menu, MenuSchema } from "./menu.schema";
import { MenuService } from "./menu.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Menu.name,
				schema: MenuSchema,
			},
		]),
	],
	controllers: [MenuController],
	providers: [MenuService],
	exports: [MenuService],
})
export class MenuModule {}
