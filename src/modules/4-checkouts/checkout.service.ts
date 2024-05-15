import { CartService } from "~modules/3-carts/cart.service";
import { CartState } from "~modules/3-carts/enums/cart-state.enum";
import { LockService } from "~modules/4-checkouts/lock.service";
import { DiscountService } from "~modules/6-discounts/discount.service";
import { OrderService } from "~modules/7-orders/order.service";

import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";

import { Types } from "mongoose";
import {
	CheckoutReviewDto,
	ShopOrderDiscountDto,
} from "./dto/checkout-review.dto";

type IShopOrderNew = {
	shopId: Types.ObjectId;
	shopDiscounts: ShopOrderDiscountDto[];
	priceRaw: number;
	priceApplyDiscount: number;
	items: {
		price: number;
		quantity: number;
		productId: Types.ObjectId;
	}[];
};

@Injectable()
export class CheckoutService {
	constructor(
		private readonly cartService: CartService,
		private readonly discountService: DiscountService,
		private readonly lockService: LockService,
		private readonly orderService: OrderService,
	) {}

	async checkoutReview({ carId, userId, shopOrders }: CheckoutReviewDto) {
		const foundCart = await this.cartService.findOne({
			_id: carId,
			state: CartState.Active,
		});
		if (!foundCart) throw new NotFoundException("Cart not found.");

		const checkoutOrder = {
			totalPrice: 0,
			feeShip: 0,
			totalDiscount: 0,
			totalCheckout: 0,
		};

		const shopOrdersNew: IShopOrderNew[] = [];

		// calc price of bill
		for (let i = 0; i < shopOrders.length; i++) {
			const { shopId, shopDiscounts = [], items = [] } = shopOrders[i];

			const checkoutProductsServer =
				await this.cartService.checkoutProductsByServer(items);

			if (!checkoutProductsServer.length)
				throw new BadRequestException("Order wrong!!! ");

			// calc total price
			const checkoutPrice = checkoutProductsServer.reduce((acc, product) => {
				return acc + product.quantity * product.price;
			}, 0);

			checkoutOrder.totalPrice = checkoutPrice;

			const itemCheckout: IShopOrderNew = {
				shopId,
				shopDiscounts,
				priceRaw: checkoutPrice, // tien truoc khi giam gia
				priceApplyDiscount: checkoutPrice,
				items: checkoutProductsServer,
			};

			// check shop discounts > 0, check discount valid
			if (shopDiscounts.length > 0) {
				// only 1 discount
				// get amount discount
				const { discount } = await this.discountService.getDiscountAmount({
					code: shopDiscounts[0].code,
					products: checkoutProductsServer,
					userId,
					shopId,
				});

				checkoutOrder.totalDiscount += discount;

				if (discount > 0) {
					itemCheckout.priceApplyDiscount = checkoutPrice - discount;
				}
			}

			// final money
			checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;

			shopOrdersNew.push(itemCheckout);
		}

		return {
			shopOrders,
			shopOrdersNew,
			checkoutOrder,
		};
	}

	async orderByUser({
		shopOrders,
		carId,
		userId,
		userAddress = {},
		userPayment = {},
	}: any) {
		const { checkoutOrder, shopOrdersNew } = await this.checkoutReview({
			carId,
			shopOrders,
			userId,
		});

		// check out stock
		// get new array products
		const products = shopOrdersNew.flatMap((order) => order.items);

		const acquireProducts = [];
		for (const product of products) {
			const keyLock = await this.lockService.acquireLock(
				product.productId,
				product.quantity,
				carId,
			);

			acquireProducts.push(keyLock ? true : false);

			if (keyLock) {
				await this.lockService.releaseLock(product.productId);
			}
		}

		// check if co san pham het hang trong kho
		if (acquireProducts.includes(false)) {
			throw new BadRequestException(
				"Mo so san pham da duoc cap nhap, vui long quay lai gio hang...",
			);
		}

		const newOrder = await this.orderService.create({
			userId,
			checkout: checkoutOrder,
			shipping: userAddress,
			payment: userPayment,
			products: shopOrdersNew,
		});

		// Truong hop: new insert thanh cong, remove product co trong cart
		if (newOrder) {
			// remove product in cart
		}

		return newOrder;
	}
}
