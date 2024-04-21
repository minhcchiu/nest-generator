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
import { GetCurrentUser } from "~decorators/get-current-user";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { TokenPayload } from "~pre-built/5-tokens/interface";
import { CommentService } from "./comment.service";
import { AuthorDto } from "./dto/author.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@Controller("comments")
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@HttpCode(HttpStatus.OK)
	@Public()
	@Get()
	async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.commentService.findMany(filter, options);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(
		@GetCurrentUser() user: TokenPayload,
		@Body() body: CreateCommentDto,
	) {
		const author: AuthorDto = {
			userId: user._id,
			avatar: user.avatar,
			fullName: user.fullName,
		};

		return this.commentService.create({ ...body, author });
	}
	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateCommentDto,
	) {
		return this.commentService.updateById(id, body);
	}

	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.commentService.deleteMany({
			_id: { $in: ids.split(",").map(stringIdToObjectId) },
		});
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.commentService.deleteById(id);
	}

	@Public()
	@Get("paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.commentService.paginate(filter, options);
	}

	@Public()
	@Get("count")
	@HttpCode(HttpStatus.OK)
	async count(@GetAqp("filter") filter: PaginationDto) {
		return this.commentService.count(filter);
	}

	@Public()
	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: PaginationDto,
	) {
		return this.commentService.findById(id, { projection, populate });
	}
}
