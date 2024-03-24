import { Types } from "mongoose";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { ParseObjectIdPipe } from "~utils/parse-object-id.pipe";

import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CartService } from "./cart.service";
import { CartProductDto } from "./dto/cart-product.dto";

@ApiTags("Carts")
@Controller("carts")
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@HttpCode(HttpStatus.CREATED)
	@Post("add_product")
	async create(
		@GetCurrentUserId() userId: string,
		@Body() product: CartProductDto,
	) {
		return this.cartService.addProductToCart({ userId, product });
	}

	@HttpCode(HttpStatus.CREATED)
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
		@GetAqp() { filter, populate, projection }: PaginationDto,
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
	@HttpCode(HttpStatus.OK)
	async count(@GetAqp("filter") filter: PaginationDto) {
		return this.cartService.count(filter);
	}
}
