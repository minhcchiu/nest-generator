import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MenuController } from "./menu.controller";
import { MenuService } from "./menu.service";
import { Menu, MenuSchema } from "./schemas/menu.schema";

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
