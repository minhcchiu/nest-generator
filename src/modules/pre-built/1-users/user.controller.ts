import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ObjectId } from "mongodb";

import { I18nContext, I18nService } from "nestjs-i18n";
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
  constructor(
    private readonly userService: UserService,
    private readonly i18n: I18nService,
  ) {}

  //  ----- Method: GET -----
  @Get("/me")
  @HttpCode(HttpStatus.OK)
  async getMe(@GetCurrentUserId() id: ObjectId, @GetAqp() { projection, populate }: PaginationDto) {
    const res = await this.userService.findById(id, {
      projection,
      populate,
    });

    return res;
  }

  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    const pagination = await this.userService.paginate(filter, options);

    return pagination;
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    const res = await this.userService.findById(id, { projection, populate });

    return res;
  }

  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    const users = await this.userService.findMany(filter, options);

    return users;
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
    const updated = await this.userService.updateById(id, { status });

    if (!updated)
      throw new NotFoundException(
        this.i18n.t("errors.USER_NOT_FOUND", { lang: I18nContext.current().lang }),
      );

    return updated;
  }

  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateUserDto) {
    await this.userService.validateCreateUser(body, { _id: { $ne: id } });

    const updated = await this.userService.updateById(id, body);

    if (!updated)
      throw new NotFoundException(
        this.i18n.t("errors.USER_NOT_FOUND", { lang: I18nContext.current().lang }),
      );

    return updated;
  }

  //  ----- Method: DELETE -----
  @Delete("me")
  @HttpCode(HttpStatus.OK)
  async deleteMe(@GetCurrentUserId() id: ObjectId) {
    const deleted = await this.userService.updateById(id, { status: AccountStatus.Deleted });

    if (!deleted)
      throw new NotFoundException(
        this.i18n.t("errors.USER_NOT_FOUND", { lang: I18nContext.current().lang }),
      );

    return deleted;
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
    const deleted = await this.userService.deleteById(id);

    if (!deleted)
      throw new NotFoundException(
        this.i18n.t("errors.USER_NOT_FOUND", { lang: I18nContext.current().lang }),
      );

    return deleted;
  }

  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManySoftByIds(@Param("ids") ids: string) {
    return this.userService.updateMany(
      { _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) } },
      { status: AccountStatus.Deleted },
    );
  }
}
