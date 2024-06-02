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
import { PaginationDto } from "~dto/pagination.dto";
import { formatMenus } from "~helpers/format-menu";
import { CreateSystemMenuDto } from "./dto/create-system-menu.dto";
import { UpdateSystemMenuDto } from "./dto/update-system-menu.dto";
import { SystemMenuService } from "./system-menu.service";

@Controller("system_menus")
export class SystemMenuController {
	constructor(private readonly systemSystemMenuService: SystemMenuService) {}

	//  ----- Method: GET -----
	@Get("/:id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: PaginationDto,
	) {
		return this.systemSystemMenuService.findById(id, { projection, populate });
	}

	@Get("/")
	async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
		const systemMenus = await this.systemSystemMenuService.findMany(
			filter,
			options,
		);

		return formatMenus(systemMenus);
	}

	//  ----- Method: POST -----
	@Post("/")
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateSystemMenuDto) {
		return this.systemSystemMenuService.create(body);
	}

	//  ----- Method: PATCH -----
	@Patch("/:id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateSystemMenuDto,
	) {
		return this.systemSystemMenuService.updateById(id, body);
	}

	//  ----- Method: DELETE -----
	@Delete(":ids/ids/hard")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.systemSystemMenuService.deleteMany({
			_id: { $in: ids.split(",").map((id) => stringIdToObjectId(id)) },
		});
	}

	@Delete(":id/hard")
	@HttpCode(HttpStatus.OK)
	async deleteHardById(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.systemSystemMenuService.deleteById(id);
	}

	@Delete("/:ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManySoftByIds(@Param("ids") ids: string) {
		return this.systemSystemMenuService.updateMany(
			{
				_id: { $in: ids.split(",").map((id) => stringIdToObjectId(id)) },
			},
			{
				deleted: true,
			},
		);
	}

	@Delete("/:id")
	@HttpCode(HttpStatus.OK)
	async deleteSoft(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.systemSystemMenuService.updateById(id, {
			deleted: true,
		});
	}
}
