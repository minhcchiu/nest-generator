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

import { PermissionService } from "../2-permissions/permission.service";
import { CreateEndpointDto } from "./dto/create-endpoint.dto";
import { UpdateEndpointDto } from "./dto/update-endpoint.dto";
import { EndpointService } from "./endpoint.service";
import { stringIdToObjectId } from "~utils/stringId_to_objectId";

@ApiTags("Endpoints")
@Controller("endpoints")
export class EndpointController {
	constructor(
		private readonly endpointService: EndpointService,
		private readonly permissionService: PermissionService,
	) {}

	//  ----- Method: GET -----
	@ApiBearerAuth()
	@ApiQueryParams()
	@Get()
	async findAll(@GetAqp() { filter, ...options }: AqpDto) {
		return this.endpointService.findAll(filter, options);
	}

	@ApiBearerAuth()
	@ApiQueryParams()
	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.endpointService.paginate(filter, options);
	}

	@ApiBearerAuth()
	@Get("count")
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.endpointService.count(filter);
	}

	@ApiBearerAuth()
	@ApiParamId()
	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.endpointService.findById(id, { projection, populate });
	}

	//  ----- Method: POST -----
	@ApiBearerAuth()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateEndpointDto) {
		return this.endpointService.create(body);
	}

	//  ----- Method: PATCH -----
	@ApiBearerAuth()
	@ApiParamId()
	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateEndpointDto,
	) {
		return this.endpointService.updateById(id, body);
	}

	//  ----- Method: DELETE -----
	@ApiBearerAuth()
	@ApiParamId()
	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.endpointService.deleteMany({
			_id: { $in: ids.split(",").map(stringIdToObjectId) },
		});
	}

	@ApiBearerAuth()
	@ApiParamId()
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
