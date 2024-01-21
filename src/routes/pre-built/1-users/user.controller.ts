import { Types } from "mongoose";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { Public } from "~decorators/public.decorator";
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
import { ApiTags } from "@nestjs/swagger";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AccountStatus } from "./enums/account-status.enum";
import { UserService } from "./user.service";

@ApiTags("Users")
@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Public()
	@Get()
	@HttpCode(HttpStatus.OK)
	async findAll(@GetAqp() { filter, ...options }: AqpDto) {
		return this.userService.findAll(filter, options);
	}

	@Public()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateUserDto) {
		await this.userService.validateCreateUser(body);

		return this.userService.create(body);
	}

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateUserDto,
	) {
		await this.userService.validateCreateUser(body);

		return this.userService.updateById(id, body);
	}

	@Patch("password")
	@HttpCode(HttpStatus.OK)
	async updatePassword(
		@GetCurrentUserId() id: string,
		@Body() body: UpdatePasswordDto,
	) {
		return this.userService.updatePasswordById(id, body);
	}

	@Delete(":ids/soft_ids")
	@HttpCode(HttpStatus.OK)
	async deleteManySoftByIds(@Param("ids") ids: string) {
		return this.userService.updateMany(
			{ _id: { $in: ids.split(",") } },
			{ status: AccountStatus.Deleted },
		);
	}

	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.userService.deleteMany({
			_id: { $in: ids.split(",") },
		});
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.userService.deleteById(id);
	}

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

	@Public()
	@Get("paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.userService.paginate(filter, options);
	}

	@Public()
	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.userService.findById(id, { projection, populate });
	}
}
