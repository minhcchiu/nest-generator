import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CheckoutService } from "./checkout.service";
import { CheckoutReviewDto } from "./dto/checkout-review.dto";

@ApiTags("Checkouts")
@Controller("checkouts")
export class CheckoutController {
	constructor(private readonly checkoutService: CheckoutService) {}

	@Post("review")
	async checkoutReview(@Body() input: CheckoutReviewDto) {
		return this.checkoutService.checkoutReview(input);
	}
}
