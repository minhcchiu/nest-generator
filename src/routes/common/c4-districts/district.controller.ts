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
import { ParseObjectIdPipe } from 'src/utils/pipe/parse-object-id.pipe';
import { ApiQueryParams } from '~decorators/api-query-params.decorator';
import { ApiQueryParamsDto } from 'src/utils/interceptor/api-query-params.dto';
import { schemas } from '~config/collections/schemas.collection';
import { DistrictService } from './district.service';

@ApiTags('Districts')
@Controller(schemas.district.path)
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  /**
   * Find all
   * @param queryParams
   * @returns
   */
  @Get('')
  @HttpCode(200)
  async findAll(
    @ApiQueryParams() queryParams: ApiQueryParamsDto,
  ): Promise<any> {
    return this.districtService.find(queryParams);
  }

  /**
   * Create
   * @param body
   * @returns
   */
  @Post('')
  @HttpCode(201)
  async create(@Body() body: any): Promise<any> {
    return this.districtService.create(body);
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
    return this.districtService.updateById(id, body);
  }

  /**
   * Delete many by ids
   * @param ids
   * @returns
   */
  @Delete(':ids/ids')
  // @HttpCode(204)
  async deleteManyByIds(@Param('ids') ids: string): Promise<any> {
    return this.districtService.deleteMany({ _id: { $in: ids.split(',') } });
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
    return this.districtService.deleteById(id);
  }

  /**
   * Paginate
   * @param query
   * @returns
   */
  @Get('paginate')
  @HttpCode(200)
  async paginate(@ApiQueryParams() query: ApiQueryParamsDto): Promise<any> {
    return this.districtService.paginate(query);
  }

  /**
   * Paginate
   * @param query
   * @returns
   */
  @Get('count')
  @HttpCode(200)
  async count(@Query() query: any): Promise<any> {
    return this.districtService.count(query);
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
    const result = await this.districtService.findById(id);

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }
}
