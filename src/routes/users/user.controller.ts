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
  Put,
  Query,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ParseObjectIdPipe } from 'src/utils/pipe/parse-object-id.pipe';
import { QueryParams } from 'src/utils/decorator/query-params.decorator';
import { QueryParamsDto } from 'src/utils/interceptor/query-params.dto';

@ApiTags('Users')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Find all
   * @param queryParams
   * @returns
   */
  @Get('')
  @HttpCode(200)
  async findAll(@QueryParams() queryParams: QueryParamsDto): Promise<any> {
    return this.userService.find(queryParams);
  }

  /**
   * Create
   * @param body
   * @returns
   */
  @Post('')
  @HttpCode(201)
  async create(@Body() body: any): Promise<any> {
    return this.userService.create(body);
  }

  /**
   * Update by ID
   * @param id
   * @param body
   * @returns
   */
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body: any,
  ): Promise<any> {
    return this.userService.updateById(id, body);
  }

  /**
   * Delete by ID
   * @param id
   * @returns
   */
  @Delete(':id')
  // @HttpCode(204)
  async delete(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<any> {
    return this.userService.deleteById(id);
  }

  /**
   * Paginate
   * @param query
   * @returns
   */
  @Get('paginate')
  @HttpCode(200)
  async paginate(@QueryParams() query: QueryParamsDto): Promise<any> {
    return this.userService.paginate(query);
  }

  /**
   * Paginate
   * @param query
   * @returns
   */
  @Get('count')
  @HttpCode(200)
  async count(@Query() query: any): Promise<any> {
    return this.userService.count(query);
  }

  /**
   * Find by id
   * @param id
   * @returns
   */
  @Get(':id')
  @HttpCode(200)
  async findOneById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<any> {
    const result = await this.userService.findById(id);

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }
}
