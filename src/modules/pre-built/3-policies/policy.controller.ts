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
import { UserGroupService } from "../2-user-groups/user-group.service";
import { CreatePolicyDto } from "./dto/create-policy.dto";
import { UpdatePolicyDto } from "./dto/update-policy.dto";
import { PolicyService } from "./policy.service";

@Controller("policies")
export class PolicyController {
	constructor(
		private readonly policyService: PolicyService,
		private readonly userGroupService: UserGroupService,
	) {}

	//  ----- Method: GET -----

	@Get()
	async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.policyService.findMany(filter, options);
	}

	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.policyService.paginate(filter, options);
	}

	@Get("count")
	async count(@GetAqp("filter") filter: PaginationDto) {
		return this.policyService.count(filter);
	}

	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: PaginationDto,
	) {
		return this.policyService.findById(id, { projection, populate });
	}

	//  ----- Method: POST -----

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreatePolicyDto) {
		return this.policyService.create(body);
	}

	//  ----- Method: PATCH -----

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdatePolicyDto,
	) {
		return this.policyService.updateById(id, body);
	}

	//  ----- Method: DELETE -----

	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.policyService.deleteMany({
			_id: { $in: ids.split(",").map(stringIdToObjectId) },
		});
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		const [deleted] = await Promise.all([
			this.policyService.deleteById(id),
			this.userGroupService.updateOne(
				{ policies: id },
				{ $pull: { policies: id } },
			),
		]);

		return deleted;
	}
}
