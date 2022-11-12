import { ApiQueryParams } from 'src/common/decorators/api-query-params.decorator';
import { ApiQueryParamsDto } from '~middleware/dto';
import { AuthAccessService } from './auth-access.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAuthAccessDto } from './dto/create-auth-access.dto';
import { Types } from 'mongoose';
import { UpdateAuthAccessDto } from './dto/update-auth-access.dto';
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

@ApiTags(dbCollections.authAccess.path)
@Controller(dbCollections.authAccess.path)
export class AuthAccessController {
  constructor(private readonly authAccessService: AuthAccessService) {}
  // ========== CREATE =================
  /**
   * Create
   *
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('')
  async create(@Body() body: CreateAuthAccessDto) {
    return this.authAccessService.create(body);
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
    return this.authAccessService.find(queryParams);
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
    return this.authAccessService.paginate(queryParams);
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
    const result = await this.authAccessService.findById(id);

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
    @Body() body: UpdateAuthAccessDto,
  ) {
    return this.authAccessService.updateById(id, body);
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
    return this.authAccessService.deleteMany({
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
    return this.authAccessService.deleteById(id);
  }
}
