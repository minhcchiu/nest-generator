import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Cart, CartDocument } from "./schemas/cart.schema";
@Injectable()
export class CartService extends BaseService<CartDocument> {
	constructor(@InjectModel(Cart.name) model: Model<CartDocument>) {
		super(model);
	}
}
