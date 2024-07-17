import { Model, Types } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateInventoryDto } from "./dto/create-inventory.dto";
import { Inventory, InventoryDocument } from "./schemas/inventory.schema";

@Injectable()
export class InventoryService extends BaseService<InventoryDocument> {
  constructor(@InjectModel(Inventory.name) _model: Model<InventoryDocument>) {
    super(_model);
  }

  async reservationInventory(data: {
    productId: Types.ObjectId;
    cartId: Types.ObjectId;
    quantity: number;
  }) {
    const filter = {
        productId: data.productId,
        stock: { $gte: data.quantity },
      },
      updateSet = {
        $inc: {
          stock: -data.quantity,
        },
        $push: {
          reservations: {
            quantity: data.quantity,
            cartId: data.cartId,
          },
        },
      },
      options = { upsert: true, new: true };

    return this.updateOne(filter, updateSet, options);
  }

  async addStockToInventory(input: CreateInventoryDto) {
    const filter = {
        shopId: input.shopId,
        productId: input.productId,
      },
      updateSet = {
        $inc: {
          stock: input.stock,
        },
        location: input.location,
      },
      options = {
        upsert: true,
        new: true,
      };

    return this.updateOne(filter, updateSet, options);
  }

  async updateInventory(order: any): Promise<void> {
    // Cập nhật kho hàng dựa trên thông tin đơn hàng
    return order;
  }
}
