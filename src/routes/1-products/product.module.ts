import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Product, ProductSchema } from "./schemas/product.schema";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

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
		]),
	],
	controllers: [ProductController],
	providers: [ProductService],
	exports: [ProductService],
})
export class ProductModule {}
