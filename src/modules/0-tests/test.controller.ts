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
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CreateTestDto } from "./dto/create-test.dto";
import { UpdateTestDto } from "./dto/update-test.dto";
import { TestService } from "./test.service";

@Controller("tests")
export class TestController {
	constructor(private readonly testService: TestService) {}

	// ----- Method: GET -----
	@Get()
	@HttpCode(HttpStatus.OK)
	async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.testService.findMany(filter, options);
	}

	@Public()
	@Get("paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.testService.paginate(filter, options);
	}

	@Public()
	@Get("count")
	@HttpCode(HttpStatus.OK)
	async count(@GetAqp("filter") filter: PaginationDto) {
		return this.testService.count(filter);
	}

	@Public()
	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: PaginationDto,
	) {
		return this.testService.findById(id, { projection, populate });
	}

	// ----- Method: POST -----
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateTestDto) {
		const created = await this.testService.create(body);

		return created;
	}

	// ----- Method: PATCH -----

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateTestDto,
	) {
		return this.testService.updateById(id, body);
	}

	// ----- Method: DELETE -----

	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.testService.deleteMany({
			_id: { $in: ids.split(",").map(stringIdToObjectId) },
		});
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.testService.deleteById(id);
	}
}
