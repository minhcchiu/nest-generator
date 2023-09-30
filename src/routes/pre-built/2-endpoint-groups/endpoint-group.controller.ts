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
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CreateEndpointGroupDto } from "./dto/create-endpoint-group.dto";
import { UpdateEndpointGroupDto } from "./dto/update-endpoint-group.dto";
import { EndpointGroupService } from "./endpoint-group.service";

@ApiTags("EndpointGroups")
@Controller("endpoint-groups")
export class EndpointGroupController {
	constructor(private readonly endpointGroupService: EndpointGroupService) {}

	@ApiQueryParams()
	@Get()
	async findAll(@GetAqp() { filter, ...options }: AqpDto) {
		return this.endpointGroupService.findAll(filter, options);
	}

	@ApiQueryParams()
	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.endpointGroupService.paginate(filter, options);
	}

	@Get("count")
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.endpointGroupService.count(filter);
	}

	@ApiParamId()
	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: string,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.endpointGroupService.findById(id, { projection, populate });
	}

	@HttpCode(201)
	@Post()
	async create(@Body() body: CreateEndpointGroupDto) {
		return this.endpointGroupService.create(body);
	}

	@ApiParamId()
	@Patch(":id")
	async update(
		@Param("id", ParseObjectIdPipe) id: string,
		@Body() body: UpdateEndpointGroupDto,
	) {
		return this.endpointGroupService.updateById(id, body);
	}

	@ApiParamId()
	@Delete(":ids/ids")
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.endpointGroupService.deleteMany({
			_id: { $in: ids.split(",") },
		});
	}

	@ApiParamId()
	@Delete(":id")
	async delete(@Param("id", ParseObjectIdPipe) id: string) {
		return this.endpointGroupService.deleteById(id);
	}
}
