import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Cart, CartDocument } from "./schemas/cart.schema";

@Injectable()
export class CartService extends BaseService<CartDocument> {
	constructor(@InjectModel(Cart.name) model: PaginateModel<CartDocument>) {
		super(model);
	}
}
