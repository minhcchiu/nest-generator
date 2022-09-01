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
import { ParseObjectIdPipe } from 'src/utils/pipe/parse-object-id.pipe';
import { ApiQueryParams } from '~decorators/api-query-params.decorator';
import { ApiQueryParamsDto } from 'src/utils/interceptor/api-query-params.dto';
import { schemas } from '~config/collections/schemas.collection';
import { WardService } from './ward.service';

@ApiTags(schemas.ward.path)
@Controller(schemas.ward.path)
export class WardController {
  constructor(private readonly wardService: WardService) {}

  /**
   * Find all
   * @param queryParams
   * @returns
   */
  @HttpCode(200)
  @Get('')
  async findAll(@ApiQueryParams() queryParams: ApiQueryParamsDto) {
    return this.wardService.find(queryParams);
  }

  /**
   * Create
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('')
  async create(@Body() body: any) {
    return this.wardService.create(body);
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
    @Body() body: any,
  ) {
    return this.wardService.updateById(id, body);
  }

  /**
   * Delete many by ids
   * @param ids
   * @returns
   */
  // @HttpCode(204)
  @Delete(':ids/ids')
  async deleteManyByIds(@Param('ids') ids: string) {
    return this.wardService.deleteMany({ _id: { $in: ids.split(',') } });
  }

  /**
   * Delete by ID
   * @param id
   * @returns
   */
  // @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.wardService.deleteById(id);
  }

  /**
   * Paginate
   * @param query
   * @returns
   */
  @HttpCode(200)
  @Get('paginate')
  async paginate(@ApiQueryParams() query: ApiQueryParamsDto) {
    return this.wardService.paginate(query);
  }

  /**
   * Paginate
   * @param query
   * @returns
   */
  @HttpCode(200)
  @Get('count')
  async count(@Query() query: any) {
    return this.wardService.count(query);
  }

  /**
   * Find by id
   * @param id
   * @returns
   */
  @HttpCode(200)
  @Get(':id')
  async findOneById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const result = await this.wardService.findById(id);

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }
}
