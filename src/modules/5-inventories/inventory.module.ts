import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { Inventory, InventorySchema } from "./schemas/inventory.schema";
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
