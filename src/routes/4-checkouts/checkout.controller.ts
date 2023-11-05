import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CheckoutReviewDto } from "./dto/checkout-review.dto";
import { CheckoutService } from "./checkout.service";

@ApiTags("Checkouts")
@Controller("checkouts")
export class CheckoutController {
	constructor(private readonly checkoutService: CheckoutService) {}

	@Post("review")
	async checkoutReview(@Body() input: CheckoutReviewDto) {
		return this.checkoutService.checkoutReview(input);
	}
}
