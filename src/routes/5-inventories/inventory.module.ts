import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Inventory, InventorySchema } from "./schemas/inventory.schema";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Inventory.name,
				schema: InventorySchema,
			},
		]),
	],
	controllers: [InventoryController],
	providers: [InventoryService],
	exports: [InventoryService],
})
export class InventoryModule {}
