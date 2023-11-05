import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { AqpDto } from "~dto/aqp.dto";
import { ParseObjectIdPipe } from "~utils/parse-object-id.pipe";

import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CreateDiscountDto } from "./dto/create-discount.dto";
import { UpdateDiscountDto } from "./dto/update-discount.dto";
import { DiscountService } from "./discount.service";
import { Types } from "mongoose";

@ApiTags("Discounts")
@Controller("discounts")
export class DiscountController {
	constructor(private readonly discountService: DiscountService) {}

	@Public()
	@Get()
	async getAll(@GetAqp() { filter, ...options }: AqpDto) {
		return this.discountService.findAll(filter, options);
	}

	@HttpCode(201)
	@Post()
	async create(@Body() body: CreateDiscountDto) {
		return this.discountService.create(body);
	}

	@Patch(":id")
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateDiscountDto,
	) {
		return this.discountService.updateById(id, body);
	}

	@Delete(":ids/ids")
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.discountService.deleteMany({
			_id: { $in: ids.split(",") },
		});
	}

	@Delete(":id")
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.discountService.deleteById(id);
	}

	@Public()
	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.discountService.paginate(filter, options);
	}

	@Public()
	@Get("count")
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.discountService.count(filter);
	}

	@Public()
	@Get("products")
	async getProductsByDiscount(
		@GetAqp() { filter: discountFilter, ...productOptions }: AqpDto,
	) {
		return this.discountService.findProductsByDiscount({
			discountFilter,
			productOptions,
		});
	}

	@Public()
	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.discountService.findById(id, { projection, populate });
	}
}
