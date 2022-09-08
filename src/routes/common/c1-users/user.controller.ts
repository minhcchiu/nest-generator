import { Types } from 'mongoose';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ParseObjectIdPipe } from 'src/utils/pipe/parse-object-id.pipe';
import { ApiQueryParams } from '~decorators/api-query-params.decorator';
import { ApiQueryParamsDto } from 'src/utils/interceptor/api-query-params.dto';
import { schemas } from '~config/collections/schemas.collection';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password';
@ApiTags(schemas.user.path)
@Controller(schemas.user.path)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Find all
   * @param queryParams
   * @returns
   */
  @HttpCode(200)
  @Get('')
  async findAll(@ApiQueryParams() queryParams: ApiQueryParamsDto) {
    return this.userService.find(queryParams);
  }

  /**
   * Create
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('')
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  /**
   * Reset password
   * @param id
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Patch(':id/password')
  async resetPassword(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body: UpdatePasswordDto,
  ) {
    await this.userService.checkPasswordById(id, body.password);

    return this.userService.updatePasswordById(id, body.newPassword);
  }

  /**
   * Update by ID
   * @param id
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Patch(':id')
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
   * Delete by ID
   * @param id
   * @returns
   */
  // @HttpCode(204)
  @Delete(':id/soft')
  async deleteSoft(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.userService.updateById(id, { deleted: true });
  }

  /**
   * Delete many by ids
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
   * @param id
   * @returns
   */
  // @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.userService.deleteById(id);
  }

  /**
   * Paginate
   * @param query
   * @returns
   */
  @HttpCode(200)
  @Get('paginate')
  async paginate(@ApiQueryParams() query: ApiQueryParamsDto) {
    return this.userService.paginate(query);
  }

  /**
   * Count
   * @param query
   * @returns
   */
  @HttpCode(200)
  @Get('count')
  async count(@Query() query: any) {
    return this.userService.count(query);
  }

  /**
   * Find by id
   * @param id
   * @returns
   */
  @HttpCode(200)
  @Get(':id')
  async findOneById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const result = await this.userService.findById(id);

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }
}
