import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ObjectId } from "mongodb";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { DiscountService } from "./discount.service";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { UpdateDiscountDto } from "./dto/update-discount.dto";

@Controller("discounts")
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Public()
  @Get("/")
  async getAll(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.discountService.findMany(filter, options);
  }

  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateDiscountDto) {
    return this.discountService.create(body);
  }
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateDiscountDto) {
    return this.discountService.updateById(id, body);
  }

  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.discountService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param("id", ParseObjectIdPipe) id: ObjectId) {
    return this.discountService.deleteById(id);
  }

  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.discountService.paginate(filter, options);
  }

  @Public()
  @Get("/count")
  @HttpCode(HttpStatus.OK)
  async count(@GetAqp("filter") filter: PaginationDto) {
    return this.discountService.count(filter);
  }

  @Public()
  @Get("products")
  async getProductsByDiscount(
    @GetAqp() { filter: discountFilter, ...productOptions }: PaginationDto,
  ) {
    return this.discountService.findProductsByDiscount({
      discountFilter,
      productOptions,
    });
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.discountService.findById(id, { projection, populate });
  }
}
