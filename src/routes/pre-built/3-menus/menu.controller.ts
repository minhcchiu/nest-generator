import { Types } from "mongoose";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { AqpDto } from "~dto/aqp.dto";
import { ParseObjectIdPipe } from "~utils/parse-object-id.pipe";

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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { stringIdToObjectId } from "~utils/stringId_to_objectId";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { MenuService } from "./menu.service";

@ApiTags("Menus")
@Controller("menus")
export class MenuController {
	constructor(private readonly menuService: MenuService) {}

	//  ----- Method: GET -----
	@ApiBearerAuth()
	@Get()
	async findMany(@GetAqp() { filter, ...options }: AqpDto) {
		return this.menuService.findMany(filter, options);
	}

	@ApiBearerAuth()
	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.menuService.paginate(filter, options);
	}

	@ApiBearerAuth()
	@Get("count")
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.menuService.count(filter);
	}

	@ApiBearerAuth()
	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.menuService.findById(id, { projection, populate });
	}

	//  ----- Method: POST -----
	@ApiBearerAuth()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateMenuDto) {
		return this.menuService.create(body);
	}

	//  ----- Method: PATCH -----
	@ApiBearerAuth()
	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateMenuDto,
	) {
		return this.menuService.updateById(id, body);
	}

	//  ----- Method: DELETE -----
	@ApiBearerAuth()
	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.menuService.deleteMany({
			_id: { $in: ids.split(",").map(stringIdToObjectId) },
		});
	}

	@ApiBearerAuth()
	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.menuService.deleteById(id);
	}
}
