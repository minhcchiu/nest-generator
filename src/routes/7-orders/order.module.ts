import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Order, OrderSchema } from "./schemas/order.schema";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Order.name,
				useFactory: () => {
					const schema = OrderSchema;

					// eslint-disable-next-line
					schema.plugin(require("mongoose-slug-updater"));

					return schema;
				},
			},
		]),
	],
	controllers: [OrderController],
	providers: [OrderService],
	exports: [OrderService],
})
export class OrderModule {}
