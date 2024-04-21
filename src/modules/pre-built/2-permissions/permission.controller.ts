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
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { PermissionService } from "./permission.service";
@Controller("permissions")
export class PermissionController {
	constructor(private readonly permissionService: PermissionService) {}

	//  ----- Method: GET -----

	@Get()
	async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.permissionService.findMany(filter, options);
	}

	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.permissionService.paginate(filter, options);
	}

	@Get("count")
	async count(@GetAqp("filter") filter: PaginationDto) {
		return this.permissionService.count(filter);
	}

	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: PaginationDto,
	) {
		return this.permissionService.findById(id, { projection, populate });
	}

	//  ----- Method: POST -----

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreatePermissionDto) {
		return this.permissionService.create(body);
	}

	//  ----- Method: PATCH -----

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdatePermissionDto,
	) {
		return this.permissionService.updateById(id, body);
	}

	//  ----- Method: DELETE -----

	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.permissionService.deleteMany({
			_id: { $in: ids.split(",").map(stringIdToObjectId) },
		});
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.permissionService.deleteById(id);
	}
}
