import { ApiQueryParams } from 'src/common/decorators/api-query-params.decorator';
import { ApiQueryParamsDto } from '~middleware/dto';
import { ApiResourceService } from './api-resource.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateApiResourceDto } from './dto/create-api-resource.dto';
import { Types } from 'mongoose';
import { UpdateApiResourceDto } from './dto/update-api-resource.dto';
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
} from '@nestjs/common';
import { dbCollections } from '~config/collections/schemas.collection';
import { ParseObjectIdPipe } from '~pipe/parse-object-id.pipe';

@ApiTags(dbCollections.apiResource.path)
@Controller(dbCollections.apiResource.path)
export class ApiResourceController {
  constructor(private readonly apiResourceService: ApiResourceService) {}
  // ========== CREATE =================
  /**
   * Create
   *
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('')
  async create(@Body() body: CreateApiResourceDto) {
    return this.apiResourceService.create(body);
  }

  // ========== READ =================
  /**
   * Find all docs
   *
   * @param queryParams
   * @returns
   */
  @HttpCode(200)
  @Get('')
  async find(@ApiQueryParams() queryParams: ApiQueryParamsDto) {
    return this.apiResourceService.find(queryParams);
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
    return this.apiResourceService.paginate(queryParams);
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
    const result = await this.apiResourceService.findById(id);

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }

  // ========== UPDATE =================
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
    @Body() body: UpdateApiResourceDto,
  ) {
    return this.apiResourceService.updateById(id, body);
  }

  // ========== DELETE =================
  /**
   * Delete many by ids
   *
   * @param ids
   * @returns
   */
  // @HttpCode(204)
  @Delete(':ids/ids')
  async deleteManyByIds(@Param('ids') ids: string) {
    return this.apiResourceService.deleteMany({
      _id: { $in: ids.split(',') },
    });
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
    return this.apiResourceService.deleteById(id);
  }
}
