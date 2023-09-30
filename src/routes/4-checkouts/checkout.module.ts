import { Module } from "@nestjs/common";
import { CheckoutController } from "./checkout.controller";
import { CheckoutService } from "./checkout.service";
import { CartModule } from "~routes/3-carts/cart.module";

@Module({
	imports: [CartModule],
	controllers: [CheckoutController],
	providers: [CheckoutService],
	exports: [CheckoutService],
})
export class CheckoutModule {}
