import { Types } from "mongoose";
import { ApiParamId } from "~decorators/api-param-id.swagger";
import { ApiQueryParams } from "~decorators/aqp.swagger";
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
import { ApiTags } from "@nestjs/swagger";

import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { PermissionService } from "./permission.service";

@ApiTags("Permissions")
@Controller("permissions")
export class PermissionController {
	constructor(private readonly permissionService: PermissionService) {}

	@ApiQueryParams()
	@Get()
	async findAll(@GetAqp() { filter, ...options }: AqpDto) {
		return this.permissionService.findAll(filter, options);
	}

	@ApiQueryParams()
	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.permissionService.paginate(filter, options);
	}

	@Get("count")
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.permissionService.count(filter);
	}

	@ApiParamId()
	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.permissionService.findById(id, { projection, populate });
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreatePermissionDto) {
		return this.permissionService.create(body);
	}

	@ApiParamId()
	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdatePermissionDto,
	) {
		return this.permissionService.updateById(id, body);
	}

	@ApiParamId()
	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.permissionService.deleteMany({
			_id: { $in: ids.split(",") },
		});
	}

	@ApiParamId()
	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.permissionService.deleteById(id);
	}
}
