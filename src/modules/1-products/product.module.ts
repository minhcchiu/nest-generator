import { Module } from "@nestjs/common";
import { forwardRef } from "@nestjs/common/utils";
import { MongooseModule } from "@nestjs/mongoose";
import { InventoryModule } from "~modules/5-inventories/inventory.module";
import { DiscountModule } from "~modules/6-discounts/discount.module";
import { RedisService } from "~shared/redis/redis.service";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Clothing, ClothingSchema } from "./schemas/clothing.schema";
import { Electronic, ElectronicSchema } from "./schemas/electronic.schema";
import { Furniture, FurnitureSchema } from "./schemas/furniture.schema";
import { Product, ProductSchema } from "./schemas/product.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Furniture.name,
        schema: FurnitureSchema,
      },
      {
        name: Clothing.name,
        schema: ClothingSchema,
      },
      {
        name: Electronic.name,
        schema: ElectronicSchema,
      },
    ]),
    InventoryModule,
    forwardRef(() => DiscountModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, RedisService],
  exports: [ProductService],
})
export class ProductModule {}
