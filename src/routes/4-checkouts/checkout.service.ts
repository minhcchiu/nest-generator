import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { CheckoutReviewDto } from "./dto/checkout-review.dto";
import { CartService } from "~routes/3-carts/cart.service";
import { cartState } from "~routes/3-carts/enums/cart-state.enum";

@Injectable()
export class CheckoutService {
	constructor(private readonly cartService: CartService) {}

	async checkoutReview({ carId, userId, shopOrders }: CheckoutReviewDto) {
		const foundCart = await this.cartService.findOne({
			_id: carId,
			state: cartState.active,
		});
		if (!foundCart) throw new NotFoundException("Cart not found.");

		const checkoutOrder = {
				totalPrice: 0,
				feeShip: 0,
				totalDiscount: 0,
				totalCheckout: 0,
			},
			shopOrdersNew = [];

		for (let i = 0; i < shopOrders.length; i++) {
			const { shopId, shopDiscounts = [], items = [] } = shopOrders[i];

			const checkoutProductsServer =
				await this.cartService.checkoutProductsByServer(items);

			if (!checkoutProductsServer[0])
				throw new BadRequestException("Order wrong!!! ");

			// calc total price
			const checkoutPrice = checkoutProductsServer.reduce((acc, product) => {
				return acc + product.quantity * product.price;
			}, 0);

			checkoutOrder.totalPrice = checkoutPrice;

			const itemCheckout = {
				shopId,
				shopDiscounts,
				priceRaw: checkoutPrice,
				priceApplyDiscount: checkoutPrice,
				items: checkoutProductsServer,
			};

			// check shop discounts > 0, check discount valid
			if (shopDiscounts.length > 0) {
			}
		}
	}
}
