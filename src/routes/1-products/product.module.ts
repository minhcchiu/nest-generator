import { InventoryModule } from "~routes/5-inventories/inventory.module";
import { DiscountModule } from "~routes/6-discounts/discount.module";
import { RedisFeatureService } from "~shared/redis-feature/redis-feature.service";

import { Module } from "@nestjs/common";
import { forwardRef } from "@nestjs/common/utils";
import { MongooseModule } from "@nestjs/mongoose";

import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Clothing, ClothingSchema } from "./schemas/clothing.schema";
import { Electronic, ElectronicSchema } from "./schemas/electronic.schema";
import { Furniture, FurnitureSchema } from "./schemas/furniture.schema";
import { Product, ProductSchema } from "./schemas/product.schema";

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Product.name,
				useFactory: () => {
					const schema = ProductSchema;

					// eslint-disable-next-line
					schema.plugin(require("mongoose-slug-updater"));

					return schema;
				},
			},
			{
				name: Clothing.name,
				useFactory: () => ClothingSchema,
			},

			{
				name: Furniture.name,
				useFactory: () => FurnitureSchema,
			},

			{
				name: Electronic.name,
				useFactory: () => ElectronicSchema,
			},
		]),
		InventoryModule,
		forwardRef(() => DiscountModule),
	],
	controllers: [ProductController],
	providers: [ProductService, RedisFeatureService],
	exports: [ProductService],
})
export class ProductModule {}
