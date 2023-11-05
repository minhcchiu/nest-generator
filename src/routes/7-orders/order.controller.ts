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

import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderService } from "./order.service";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { Types } from "mongoose";

@ApiTags("Orders")
@Controller("orders")
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Public()
	@Get()
	async findAll(@GetAqp() { filter, ...options }: AqpDto) {
		return this.orderService.findAll(filter, options);
	}

	@HttpCode(201)
	@Post()
	async create(
		@GetCurrentUserId() userId: string,
		@Body() body: CreateOrderDto,
	) {
		return this.orderService.create({ ...body, orderedBy: userId });
	}

	@Patch(":id")
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateOrderDto,
	) {
		return this.orderService.updateById(id, body);
	}

	@Delete(":ids/ids")
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.orderService.deleteMany({
			_id: { $in: ids.split(",") },
		});
	}

	@Delete(":id")
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.orderService.deleteById(id);
	}

	@Public()
	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.orderService.paginate(filter, options);
	}

	@Public()
	@Get("count")
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.orderService.count(filter);
	}

	@Public()
	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.orderService.findById(id, { projection, populate });
	}
}
