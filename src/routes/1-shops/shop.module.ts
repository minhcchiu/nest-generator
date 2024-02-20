import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Shop, ShopSchema } from "./schemas/shop.schema";
import { ShopController } from "./shop.controller";
import { ShopService } from "./shop.service";

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Shop.name,
				useFactory: () => {
					const schema = ShopSchema;

					// eslint-disable-next-line
					schema.plugin(require("mongoose-slug-updater"));

					return schema;
				},
			},
		]),
	],
	controllers: [ShopController],
	providers: [ShopService],
	exports: [ShopService],
})
export class ShopModule {}
