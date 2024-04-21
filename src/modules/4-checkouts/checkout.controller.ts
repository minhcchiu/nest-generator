import { Body, Controller, Post } from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { CheckoutReviewDto } from "./dto/checkout-review.dto";
@Controller("checkouts")
export class CheckoutController {
	constructor(private readonly checkoutService: CheckoutService) {}

	@Post("review")
	async checkoutReview(@Body() input: CheckoutReviewDto) {
		return this.checkoutService.checkoutReview(input);
	}
}
