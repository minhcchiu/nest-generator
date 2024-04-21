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
import { PermissionService } from "../2-permissions/permission.service";
import { CreateEndpointDto } from "./dto/create-endpoint.dto";
import { UpdateEndpointDto } from "./dto/update-endpoint.dto";
import { EndpointService } from "./endpoint.service";

@Controller("endpoints")
export class EndpointController {
	constructor(
		private readonly endpointService: EndpointService,
		private readonly permissionService: PermissionService,
	) {}

	//  ----- Method: GET -----

	@Get()
	async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.endpointService.findMany(filter, options);
	}

	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.endpointService.paginate(filter, options);
	}

	@Get("count")
	async count(@GetAqp("filter") filter: PaginationDto) {
		return this.endpointService.count(filter);
	}

	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: PaginationDto,
	) {
		return this.endpointService.findById(id, { projection, populate });
	}

	//  ----- Method: POST -----

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateEndpointDto) {
		return this.endpointService.create(body);
	}

	//  ----- Method: PATCH -----

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateEndpointDto,
	) {
		return this.endpointService.updateById(id, body);
	}

	//  ----- Method: DELETE -----

	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.endpointService.deleteMany({
			_id: { $in: ids.split(",").map(stringIdToObjectId) },
		});
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		const [deleted] = await Promise.all([
			this.endpointService.deleteById(id),
			this.permissionService.updateOne(
				{ endpoints: id },
				{ $pull: { endpoints: id } },
			),
		]);

		return deleted;
	}
}
