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

import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { CartService } from "./cart.service";
import { GetCurrentUser } from "~decorators/get-current-user";
import { TokenPayload } from "~routes/pre-built/5-tokens/interface";
import { AuthorDto } from "~routes/2-comments/dto/author.dto";

@ApiTags("Carts")
@Controller("carts")
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Public()
	@Get()
	async find(@GetAqp() { filter, ...options }: AqpDto) {
		return this.cartService.find(filter, options);
	}

	@HttpCode(201)
	@Post()
	async create(
		@GetCurrentUser() user: TokenPayload,
		@Body() body: CreateCartDto,
	) {
		const author: AuthorDto = {
			userId: user._id.toString(),
			avatar: user.avatar,
			fullName: user.fullName,
		};

		return this.cartService.create({ ...body, author });
	}

	@Patch(":id")
	async update(
		@Param("id", ParseObjectIdPipe) id: string,
		@Body() body: UpdateCartDto,
	) {
		return this.cartService.updateById(id, body);
	}

	@Delete(":ids/ids")
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.cartService.deleteMany({
			_id: { $in: ids.split(",") },
		});
	}

	@Delete(":id")
	async delete(@Param("id", ParseObjectIdPipe) id: string) {
		return this.cartService.deleteById(id);
	}

	@Public()
	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.cartService.paginate(filter, options);
	}

	@Public()
	@Get("count")
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.cartService.count(filter);
	}

	@Public()
	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: string,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.cartService.findById(id, { projection, populate });
	}
}
