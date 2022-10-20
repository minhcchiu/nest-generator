import { Types } from 'mongoose';
import { ApiQueryParams } from 'src/common/decorators/api-query-params.decorator';
import { ApiQueryParamsDto } from 'src/middlewares/dto';
import { dbCollections } from '~config/collections/schemas.collection';
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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FileService } from './file.service';

@ApiTags(dbCollections.file.path)
@Controller(dbCollections.file.path)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * Find all docs
   *
   * @param queryParams
   * @returns
   */
  @HttpCode(200)
  @Get('')
  async find(@ApiQueryParams() queryParams: ApiQueryParamsDto) {
    return this.fileService.find(queryParams);
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
    return this.fileService.paginate(queryParams);
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
    return this.fileService.count(query);
  }

  /**
   * Find by id
   *
   * @param id
   * @returns
   */
  @HttpCode(200)
  @Get(':id')
  async findOneById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const result = await this.fileService.findById(id);

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
  async create(@Body() body: any) {
    return this.fileService.create(body);
  }

  /**
   * Update by ID
   *
   * @param id
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Put(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body: any,
  ) {
    return this.fileService.updateById(id, body);
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
    return this.fileService.deleteMany({ _id: { $in: ids.split(',') } });
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
    return this.fileService.deleteById(id);
  }
}
