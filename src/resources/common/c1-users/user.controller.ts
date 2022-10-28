import { Types } from 'mongoose';
import { ApiQueryParams } from 'src/common/decorators/api-query-params.decorator';
import { AtGuard } from 'src/common/guards';
import { ApiQueryParamsDto } from 'src/middlewares/dto';
import { dbCollections } from '~config/collections/schemas.collection';
import { GetCurrentUserId } from '~decorators/get-current-user-id.decorator';
import { ParseObjectIdPipe } from '~pipe/parse-object-id.pipe';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags(dbCollections.user.path)
@Controller(dbCollections.user.path)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Find all docs
   *
   * @param queryParams
   * @returns
   */
  @HttpCode(200)
  @Get('')
  async find(@ApiQueryParams() queryParams: ApiQueryParamsDto) {
    return this.userService.find(queryParams);
  }

  /**
   * Paginate
   *
   * @param queryParams
   * @returns
   */
  @HttpCode(200)
  @Get('paginate')
  async paginate(@ApiQueryParams() queryParams: ApiQueryParamsDto) {
    return this.userService.paginate(queryParams);
  }

  /**
   * Count
   *
   * @param query
   * @returns
   */
  @HttpCode(200)
  @Get('count')
  async count(@Query() query: any) {
    return this.userService.count(query);
  }

  /**
   * Get user logged in
   *
   * @param id
   * @returns
   */
  @HttpCode(200)
  @UseGuards(AtGuard)
  @Get('me')
  async getMe(@GetCurrentUserId() id: Types.ObjectId) {
    return this.userService.findById(id);
  }

  /**
   * Find by id
   *
   * @param id
   * @returns
   */
  @HttpCode(200)
  @Get(':id')
  async findOneById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @ApiQueryParams() { population, projection }: ApiQueryParamsDto,
  ) {
    const result = await this.userService.findById(id, {
      population,
      projection,
    });

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }

  /**
   * Create
   *
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('')
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  /**
   * Update password
   *
   * @param id
   * @param body
   * @returns
   */
  @HttpCode(200)
  @UseGuards(AtGuard)
  @Put('password')
  async resetPassword(
    @GetCurrentUserId() id: Types.ObjectId,
    @Body() body: UpdatePasswordDto,
  ) {
    await this.userService.checkPasswordById(id, body.password);

    return this.userService.updatePasswordById(id, body.newPassword);
  }

  /**
   * Update by ID
   *
   * @param id
   * @param body
   * @returns
   */
  @HttpCode(200)
  @UseGuards(AtGuard)
  @Put(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body: UpdateUserDto,
  ) {
    const filterValidate = {};

    if (body.phone) filterValidate['phone'] = body.phone;

    if (body.email) filterValidate['email'] = body.email;

    await this.userService.validateCreateUser(filterValidate);

    return this.userService.updateById(id, body);
  }

  /**
   * Delete many by ids
   *
   * @param ids
   * @returns
   */
  // @HttpCode(204)
  @Delete(':ids/soft-ids')
  async deleteManySoftByIds(@Param('ids') ids: string) {
    return this.userService.updateMany(
      { _id: { $in: ids.split(',') } },
      { deleted: true },
    );
  }

  /**
   * Delete many by ids
   *
   * @param ids
   * @returns
   */
  // @HttpCode(204)
  @Delete(':ids/ids')
  async deleteManyByIds(@Param('ids') ids: string) {
    return this.userService.deleteMany({ _id: { $in: ids.split(',') } });
  }

  /**
   * Delete by ID
   *
   * @param id
   * @returns
   */
  // @HttpCode(204)
  @Delete(':id/soft')
  async deleteSoft(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.userService.updateById(id, { deleted: true });
  }

  /**
   * Delete by ID
   *
   * @param id
   * @returns
   */
  // @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.userService.deleteById(id);
  }
}
