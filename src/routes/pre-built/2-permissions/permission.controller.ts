import { Types } from "mongoose";
import { ApiParamId } from "src/common/swaggers/api-param-id.swagger";
import { ApiQueryParams } from "src/common/swaggers/api-query-params.swagger";
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

import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { PermissionService } from "./permission.service";

@ApiTags("Permissions")
@Controller("permissions")
export class PermissionController {
	constructor(private readonly permissionService: PermissionService) {}

	//  ----- Method: GET -----
	@ApiBearerAuth()
	@ApiQueryParams()
	@Get()
	async findAll(@GetAqp() { filter, ...options }: AqpDto) {
		return this.permissionService.findAll(filter, options);
	}

	@ApiBearerAuth()
	@ApiQueryParams()
	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.permissionService.paginate(filter, options);
	}

	@ApiBearerAuth()
	@Get("count")
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.permissionService.count(filter);
	}

	@ApiBearerAuth()
	@ApiParamId()
	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.permissionService.findById(id, { projection, populate });
	}

	//  ----- Method: POST -----
	@ApiBearerAuth()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreatePermissionDto) {
		return this.permissionService.create(body);
	}

	//  ----- Method: PATCH -----
	@ApiBearerAuth()
	@ApiParamId()
	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdatePermissionDto,
	) {
		return this.permissionService.updateById(id, body);
	}

	//  ----- Method: DELETE -----
	@ApiBearerAuth()
	@ApiParamId()
	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.permissionService.deleteMany({
			_id: { $in: ids.split(",") },
		});
	}

	@ApiBearerAuth()
	@ApiParamId()
	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.permissionService.deleteById(id);
	}
}
