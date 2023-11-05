import { Module } from "@nestjs/common";
import { forwardRef } from "@nestjs/common/utils";
import { MongooseModule } from "@nestjs/mongoose";

import { Discount, DiscountSchema } from "./schemas/discount.schema";
import { DiscountController } from "./discount.controller";
import { DiscountService } from "./discount.service";
import { ProductModule } from "~routes/1-products/product.module";

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Discount.name,
				schema: DiscountSchema,
			},
		]),
		forwardRef(() => ProductModule),
	],
	controllers: [DiscountController],
	providers: [DiscountService],
	exports: [DiscountService],
})
export class DiscountModule {}
