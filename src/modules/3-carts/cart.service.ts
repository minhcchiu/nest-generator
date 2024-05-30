import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { ProductService } from "~modules/1-products/product.service";
import { ShopOrderItemDto } from "~modules/4-checkouts/dto/checkout-review.dto";
import { AddProductToCartDto } from "./dto/add-product-to-cart.dto";
import { UpdateCartProductDto } from "./dto/cart-product.dto";
import { CartState } from "./enums/cart-state.enum";
import { Cart, CartDocument } from "./schemas/cart.schema";

@Injectable()
export class CartService extends BaseService<CartDocument> {
	private cartModel: Model<CartDocument>;

	constructor(
		@InjectModel(Cart.name) _model: Model<CartDocument>,
		private readonly productService: ProductService,
	) {
		super(_model);

		this.cartModel = _model;
	}

	async addProductToCart({ product, userId }: AddProductToCartDto) {
		const cart = await this.cartModel.findOne({ userId });

		// create user cart
		if (!cart) return this.cartModel.create({ products: [product], userId });

		// update product to carts
		if (cart.products.length === 0) {
			cart.products = [product];
			cart.state = CartState.Active;

			return cart.save();
		}

		// update quantity
		return this.updateProductQuantity(cart._id, {
			userId,
			productId: product.productId,
			quantity: product.quantity,
		});
	}

	async updateProductQuantity(
		cartId: Types.ObjectId,
		input: {
			userId: Types.ObjectId;
			productId: Types.ObjectId;
			quantity: number;
		},
	) {
		const { productId, quantity, userId } = input;

		const query = {
				_id: cartId,
				userId: userId,
				"products.productId": productId,
			},
			updateSet = {
				$inc: {
					"products.$.quantity": quantity,
				},
			},
			options = {
				new: true,
				upsert: true,
			};

		return this.updateOne(query, updateSet, options);
	}

	async updateCartProduct(input: {
		userId: Types.ObjectId;
		product: UpdateCartProductDto;
	}) {
		const { userId, product } = input;

		if (product.quantity === 0)
			return this.deleteCartProduct(userId, product.productId);

		return this.cartModel.updateOne(
			{
				userId,
				"products.productId": product.productId,
			},
			{
				$inc: {
					"products.$.quantity": product.quantity - product.oldQuantity,
				},
			},
		);
	}

	async deleteCartProduct(userId: Types.ObjectId, productId: Types.ObjectId) {
		const filter = { userId: userId, state: CartState.Active },
			$pull = {
				products: productId,
			};

		return this.cartModel.updateOne(filter, { $pull });
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
