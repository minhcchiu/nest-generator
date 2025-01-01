import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ObjectId } from "mongodb";

import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AccountStatus } from "./enums/account-status.enum";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  //  ----- Method: GET -----
  @Get("/me")
  @HttpCode(HttpStatus.OK)
  async getMe(@GetCurrentUserId() id: string, @GetAqp() { projection, populate }: PaginationDto) {
    return this.userService.findById(stringIdToObjectId(id), {
      projection,
      populate,
    });
  }

  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.userService.paginate(filter, options);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.userService.findById(id, { projection, populate });
  }

  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.userService.findMany(filter, options);
  }

  //  ----- Method: POST -----
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateUserDto) {
    await this.userService.validateCreateUser(body);

    return this.userService.createUser(body);
  }

  //  ----- Method: PATCH -----
  @Patch("password")
  @HttpCode(HttpStatus.OK)
  async updatePassword(@GetCurrentUserId() id: ObjectId, @Body() body: UpdatePasswordDto) {
    return this.userService.updatePasswordById(id, body);
  }

  @Patch(":id/status")
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @Body("status", new ParseEnumPipe(AccountStatus)) status: AccountStatus,
  ) {
    return this.userService.updateById(id, { status });
  }

  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateUserDto) {
    await this.userService.validateCreateUser(body);

    return this.userService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Delete("me")
  @HttpCode(HttpStatus.OK)
  async deleteMe(@GetCurrentUserId() id: ObjectId) {
    return this.userService.updateById(id, { status: AccountStatus.Deleted });
  }

  @Delete(":ids/bulk/hard")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.userService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }

  @Delete(":id/hard")
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param("id", ParseObjectIdPipe) id: ObjectId) {
    return this.userService.deleteById(id);
  }

  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManySoftByIds(@Param("ids") ids: string) {
    return this.userService.updateMany(
      { _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) } },
      { status: AccountStatus.Deleted },
    );
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  async deleteSoft(@Param("id", ParseObjectIdPipe) id: ObjectId) {
    return this.userService.updateById(id, { status: AccountStatus.Deleted });
  }
}
