import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductGroupController } from "./product-group.controller";
import { ProductGroupService } from "./product-group.service";
import {
	ProductGroup,
	ProductGroupSchema,
} from "./schemas/product-group.schema";
@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: ProductGroup.name,
				schema: ProductGroupSchema,
			},
		]),
	],
	controllers: [ProductGroupController],
	providers: [ProductGroupService],
	exports: [ProductGroupService],
})
export class ProductGroupModule {}
