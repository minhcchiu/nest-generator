import { Module } from "@nestjs/common";
import { CartModule } from "~modules/3-carts/cart.module";
import { LockService } from "~modules/4-checkouts/lock.service";
import { InventoryModule } from "~modules/5-inventories/inventory.module";
import { DiscountModule } from "~modules/6-discounts/discount.module";
import { OrderModule } from "~modules/7-orders/order.module";
import { CheckoutController } from "./checkout.controller";
import { CheckoutService } from "./checkout.service";

@Module({
  imports: [CartModule, DiscountModule, InventoryModule, OrderModule],
  controllers: [CheckoutController],
  providers: [CheckoutService, LockService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
