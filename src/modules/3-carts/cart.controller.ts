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
import { ObjectId } from "mongodb";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CartService } from "./cart.service";
import { CartProductDto } from "./dto/cart-product.dto";

@Controller("carts")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("add_product")
  async create(@GetCurrentUserId() userId: ObjectId, @Body() product: CartProductDto) {
    return this.cartService.addProductToCart({ userId, product });
  }

  @HttpCode(HttpStatus.CREATED)
  @Patch("carts/:cartId/products/:productId")
  async updateProductQuantity(
    @GetCurrentUserId() userId: ObjectId,
    @Param("cartId", ParseObjectIdPipe) cartId: ObjectId,
    @Param("productId", ParseObjectIdPipe) productId: ObjectId,
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
    @GetCurrentUserId() userId: ObjectId,
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
  @Get("/count")
  @HttpCode(HttpStatus.OK)
  async count(@GetAqp("filter") filter: PaginationDto) {
    return this.cartService.count(filter);
  }
}
