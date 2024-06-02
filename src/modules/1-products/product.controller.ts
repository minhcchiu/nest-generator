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

import { Types } from "mongoose";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductService } from "./product.service";

@Controller("products")
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@HttpCode(HttpStatus.OK)
	@Public()
	@Get("/")
	async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
		await this.productService.placeOrder();
		return this.productService.findMany(filter, options);
	}

	@Post("/")
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateProductDto) {
		return this.productService.createProduct(body);
	}
	@Patch("/:id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateProductDto,
	) {
		return this.productService.updateById(id, body);
	}

	@Delete("/:ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.productService.deleteMany({
			_id: { $in: ids.split(",").map((id) => stringIdToObjectId(id)) },
		});
	}

	@Delete("/:id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.productService.deleteById(id);
	}

	@Public()
	@Get("/paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.productService.paginate(filter, options);
	}

	@Public()
	@Get("/count")
	@HttpCode(HttpStatus.OK)
	async count(@GetAqp("filter") filter: PaginationDto) {
		return this.productService.count(filter);
	}

	@Public()
	@Get("/:id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: PaginationDto,
	) {
		const product = await this.productService.findById(id, {
			projection,
			populate,
		});

		return product;
	}
}
