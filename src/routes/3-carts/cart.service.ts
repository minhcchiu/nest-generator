import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Cart, CartDocument } from "./schemas/cart.schema";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { CartProductDto } from "./dto/cart-product.dto";
import { ShopOrderItemDto } from "~routes/4-checkouts/dto/checkout-review.dto";
import { ProductService } from "~routes/1-products/product.service";

@Injectable()
export class CartService extends BaseService<CartDocument> {
	private cartModel: PaginateModel<CartDocument>;

	constructor(
		@InjectModel(Cart.name) _model: PaginateModel<CartDocument>,
		private readonly productService: ProductService,
	) {
		super(_model);

		this.cartModel = _model;
	}

	async addToCart({ product, userId }: AddToCartDto) {
		const userCart = await this.cartModel.findOne({ userId });

		// create user cart
		if (!userCart)
			return this.cartModel.create({ products: [product], userId });

		// update product to carts
		if (userCart.products.length === 0) {
			userCart.products = [product];

			return userCart.save();
		}

		// update quantity
		return this.updateQuantity({ userId, product });
	}

	async updateQuantity(input: { userId: string; product: CartProductDto }) {
		const { productId, quantity } = input.product;

		const query = { userId: input.userId, "products.productId": productId },
			updateSet = {
				$inc: {
					"products.$.quantity": quantity,
				},
			},
			options = {
				new: true,
				upsert: true,
			};

		return this.cartModel.findOneAndUpdate(query, updateSet, options);
	}

	async checkoutProductsByServer(items: ShopOrderItemDto[]) {
		return Promise.all(
			items.map(async (product) => {
				const foundProduct = await this.productService.findById(
					product.productId,
				);

				if (foundProduct) {
					return {
						price: foundProduct.price,
						quantity: product.quantity,
						productId: product.productId,
					};
				}
			}),
		);
	}
}
