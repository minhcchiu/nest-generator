import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductModule } from "~modules/1-products/product.module";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { Cart, CartSchema } from "./schemas/cart.schema";

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Cart.name,
				schema: CartSchema,
			},
		]),
		ProductModule,
	],
	controllers: [CartController],
	providers: [CartService],
	exports: [CartService],
})
export class CartModule {}
