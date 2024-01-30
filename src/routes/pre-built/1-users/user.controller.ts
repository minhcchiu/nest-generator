import { Types } from "mongoose";
import { ApiParamId } from "~decorators/api-param-id.swagger";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { AqpDto } from "~dto/aqp.dto";
import { ParseObjectIdPipe } from "~utils/parse-object-id.pipe";
import { stringIdToObjectId } from "~utils/stringId_to_objectId";

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
	async findAll(@GetAqp() { filter, ...options }: AqpDto) {
		return this.userService.findAll(filter, options);
	}

	@ApiBearerAuth()
	@Get("/me")
	@HttpCode(HttpStatus.OK)
	async getMe(
		@GetCurrentUserId() id: string,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.userService.findById(stringIdToObjectId(id), {
			projection,
			populate,
		});
	}

	@ApiBearerAuth()
	@Get("paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.userService.paginate(filter, options);
	}

	@ApiBearerAuth()
	@ApiParamId()
	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.userService.findById(id, { projection, populate });
	}

	//  ----- Method: POST -----
	@ApiBearerAuth()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateUserDto) {
		await this.userService.validateCreateUser(body);

		return this.userService.create(body);
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
			{ _id: { $in: ids.split(",") } },
			{ status: AccountStatus.Deleted },
		);
	}

	@ApiBearerAuth()
	@ApiParamId()
	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.userService.deleteMany({
			_id: { $in: ids.split(",") },
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
