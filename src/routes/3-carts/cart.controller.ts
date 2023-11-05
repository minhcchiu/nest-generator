import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { AqpDto } from "~dto/aqp.dto";
import { ParseObjectIdPipe } from "~utils/parse-object-id.pipe";

import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	ParseIntPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CartService } from "./cart.service";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { CartProductDto } from "./dto/cart-product.dto";
import { Types } from "mongoose";

@ApiTags("Carts")
@Controller("carts")
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@HttpCode(201)
	@Post("add_product")
	async create(
		@GetCurrentUserId() userId: string,
		@Body() product: CartProductDto,
	) {
		return this.cartService.addProductToCart({ userId, product });
	}

	@HttpCode(201)
	@Patch("carts/:cartId/products/:productId")
	async updateProductQuantity(
		@GetCurrentUserId() userId: string,
		@Param("cartId", ParseObjectIdPipe) cartId: Types.ObjectId,
		@Param("productId") productId: string,
		@Body("quantity", ParseIntPipe) quantity: number,
	) {
		return this.cartService.updateProductQuantity(cartId, {
			userId,
			productId,
			quantity,
		});
	}

	@Get(":userId/user")
	async findOne(
		@GetCurrentUserId() userId: string,
		@GetAqp() { filter, populate, projection }: AqpDto,
	) {
		return this.cartService.findOne(
			{ ...filter, userId },
			{
				populate,
				projection,
			},
		);
	}

	@Public()
	@Get("count")
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.cartService.count(filter);
	}
}
