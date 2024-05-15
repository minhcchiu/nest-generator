import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Order, OrderDocument } from "./schemas/order.schema";
@Injectable()
export class OrderService extends BaseService<OrderDocument> {
	constructor(@InjectModel(Order.name) model: PaginateModel<OrderDocument>) {
		super(model);
	}
}
