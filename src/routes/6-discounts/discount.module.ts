import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Discount, DiscountSchema } from "./schemas/discount.schema";
import { DiscountController } from "./discount.controller";
import { DiscountService } from "./discount.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Discount.name,
				schema: DiscountSchema,
			},
		]),
	],
	controllers: [DiscountController],
	providers: [DiscountService],
	exports: [DiscountService],
})
export class DiscountModule {}
