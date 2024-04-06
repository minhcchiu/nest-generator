import { Types } from "mongoose";
import { ApiParamId } from "src/common/swaggers/api-param-id.swagger";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { PaginationDto } from "~dto/pagination.dto";

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

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AccountStatus } from "./enums/account-status.enum";
import { UserService } from "./user.service";

@ApiTags("Users")
@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {}

	//  ----- Method: GET -----
	@ApiBearerAuth()
	@Get()
	@HttpCode(HttpStatus.OK)
	async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.userService.findMany(filter, options);
	}

	@ApiBearerAuth()
	@Get("/me")
	@HttpCode(HttpStatus.OK)
	async getMe(
		@GetCurrentUserId() id: string,
		@GetAqp() { projection, populate }: PaginationDto,
	) {
		return this.userService.findById(stringIdToObjectId(id), {
			projection,
			populate,
		});
	}

	@ApiBearerAuth()
	@Get("paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.userService.paginate(filter, options);
	}

	@ApiBearerAuth()
	@ApiParamId()
	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: PaginationDto,
	) {
		return this.userService.findById(id, { projection, populate });
	}

	//  ----- Method: POST -----
	@ApiBearerAuth()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateUserDto) {
		await this.userService.validateCreateUser(body);

		return this.userService.createUser(body);
	}

	//  ----- Method: PATCH -----
	@ApiBearerAuth()
	@ApiParamId()
	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateUserDto,
	) {
		await this.userService.validateCreateUser(body);

		return this.userService.updateById(id, body);
	}

	@ApiBearerAuth()
	@Patch("password")
	@HttpCode(HttpStatus.OK)
	async updatePassword(
		@GetCurrentUserId() id: string,
		@Body() body: UpdatePasswordDto,
	) {
		return this.userService.updatePasswordById(id, body);
	}

	//  ----- Method: DELETE -----
	@ApiBearerAuth()
	@ApiParamId()
	@Delete(":ids/soft_ids")
	@HttpCode(HttpStatus.OK)
	async deleteManySoftByIds(@Param("ids") ids: string) {
		return this.userService.updateMany(
			{ _id: { $in: ids.split(",").map(stringIdToObjectId) } },
			{ status: AccountStatus.Deleted },
		);
	}

	@ApiBearerAuth()
	@ApiParamId()
	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.userService.deleteMany({
			_id: { $in: ids.split(",").map(stringIdToObjectId) },
		});
	}

	@ApiBearerAuth()
	@ApiParamId()
	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.userService.deleteById(id);
	}
}
