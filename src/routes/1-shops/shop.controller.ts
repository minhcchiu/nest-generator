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

import { CreateShopDto } from "./dto/create-shop.dto";
import { UpdateShopDto } from "./dto/update-shop.dto";
import { ShopService } from "./shop.service";
import { Types } from "mongoose";

@ApiTags("Shops")
@Controller("shops")
export class ShopController {
	constructor(private readonly shopService: ShopService) {}

	@Public()
	@Get()
	async findAll(@GetAqp() { filter, ...options }: AqpDto) {
		return this.shopService.findAll(filter, options);
	}

	@HttpCode(201)
	@Post()
	async create(@Body() body: CreateShopDto) {
		return this.shopService.create(body);
	}

	@Patch(":id")
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateShopDto,
	) {
		return this.shopService.updateById(id, body);
	}

	@Delete(":ids/ids")
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.shopService.deleteMany({
			_id: { $in: ids.split(",") },
		});
	}

	@Delete(":id")
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.shopService.deleteById(id);
	}

	@Public()
	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.shopService.paginate(filter, options);
	}

	@Public()
	@Get("count")
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.shopService.count(filter);
	}

	@Public()
	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.shopService.findById(id, { projection, populate });
	}
}
