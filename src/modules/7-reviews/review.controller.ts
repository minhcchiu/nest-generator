import { Types } from "mongoose";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
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
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ReviewService } from "./review.service";

@ApiTags("Reviews")
@Controller("reviews")
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	// ----- Method: GET -----
	@Public()
	@Get("paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.reviewService.paginate(filter, options);
	}

	@Public()
	@Get("count")
	@HttpCode(HttpStatus.OK)
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.reviewService.count(filter);
	}

	@Public()
	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.reviewService.findById(id, { projection, populate });
	}

	// ----- Method: POST -----
	@ApiBearerAuth()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateReviewDto) {
		return this.reviewService.create(body);
	}

	// ----- Method: PATCH -----
	@ApiBearerAuth()
	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateReviewDto,
	) {
		return this.reviewService.updateById(id, body);
	}

	// ----- Method: DELETE -----
	@ApiBearerAuth()
	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.reviewService.deleteMany({
			_id: { $in: ids.split(",").map(stringIdToObjectId) },
		});
	}

	@ApiBearerAuth()
	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.reviewService.deleteById(id);
	}
}
