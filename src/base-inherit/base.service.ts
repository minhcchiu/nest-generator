import {
  PaginateDocument,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
  QueryOptions,
  Types,
} from 'mongoose';
import { NotFoundException } from '@nestjs/common';

import { BaseInterface } from './base.interface';
import { QueryParamsDto } from 'src/utils/interceptor/query-params.dto';

export class BaseService<T> implements BaseInterface<T> {
  private model: PaginateModel<T>;

  constructor(model: PaginateModel<T>) {
    this.model = model;
  }

  /**
   * Find all
   * @param queryParams
   * @returns
   */
  async find(queryParams: QueryParamsDto): Promise<any[] | []> {
    const { filter, ...options } = queryParams;

    return this.model.find(filter, options.projection, options).lean();
  }

  /**
   * Find by ID
   * @param id
   * @param options
   * @returns
   */
  async findById(
    id: Types.ObjectId,
    options: QueryOptions = {},
  ): Promise<any | null> {
    return this.model.findById(id, options.projection, options).lean();
  }

  /**
   * Find one
   * @param id
   * @param options
   * @returns
   */
  async findOne(
    id: Types.ObjectId,
    options: QueryOptions = {},
  ): Promise<any | null> {
    return this.model.findOne(id, options.projection, options).lean();
  }

  /**
   * Create new
   * @param payload
   * @returns
   */
  async create(payload: any): Promise<any> {
    return this.model.create(payload);
  }

  /**
   * Find by ID and update
   * @param id
   * @param updates
   * @param options
   * @returns
   */
  async updateById(
    id: Types.ObjectId,
    updates: any,
    options: QueryOptions = {},
  ): Promise<any | null> {
    const updated = await this.model
      .findByIdAndUpdate(id, updates, options)
      .lean();

    if (!updated) throw new NotFoundException('Item not found.');

    return updated;
  }

  /**
   * Find one and update
   * @param query
   * @param payload
   * @param options
   * @returns
   */
  async updateOne(
    query: object,
    payload: any,
    options: QueryOptions = { new: true },
  ): Promise<any | null> {
    const updated = await this.model.updateOne(query, payload, options).lean();

    if (!updated) throw new NotFoundException('Item not found.');

    return updated;
  }

  /**
   * Update many
   * @param query
   * @param payload
   * @param options
   * @returns
   */
  async updateMany(
    query: object = {},
    payload: any,
    options: QueryOptions = {},
  ): Promise<any> {
    return this.model.updateMany(query, payload, options).lean();
  }

  /**
   * Find by id and delete
   * @param id
   * @param options
   * @returns
   */
  async deleteById(
    id: Types.ObjectId,
    options: QueryOptions = {},
  ): Promise<any> {
    const deleted = this.model.findByIdAndDelete(id, options).lean();

    if (!deleted) throw new NotFoundException('Item not found.');

    return deleted;
  }

  /**
   * Find one and delete
   * @param query
   * @param options
   * @returns
   */
  async deleteOne(
    query: object,
    options: QueryOptions = {},
  ): Promise<any | null> {
    const deleted = this.model.deleteOne(query, options).lean();

    if (!deleted) throw new NotFoundException('Item not found.');

    return deleted;
  }

  /**
   * Delete many
   * @param query
   * @param options
   * @returns
   */
  async deleteMany(
    query: object = {},
    options: QueryOptions = {},
  ): Promise<any | null> {
    return this.model.deleteMany(query || {}, options).lean();
  }

  /**
   * Find and paginate
   * @param queryParams
   * @returns
   */
  async paginate(
    queryParams: QueryParamsDto,
  ): Promise<PaginateResult<PaginateDocument<T, any, PaginateOptions>>> {
    const customLabels = {
      docs: 'docs',
      limit: 'limit',
      page: 'page',
      totalPages: 'totalPages',
      totalDocs: 'totalDocs',
      meta: 'pageInfo',
    };

    const pageInfo = {
      lean: true,
      page: queryParams.skip || 1,
      limit: queryParams.limit || 20,
      sort: queryParams.sort || '-updatedAt',
      populate: queryParams.population || [],
      projection: queryParams.projection || {},
      customLabels,
    };

    return this.model.paginate(queryParams.filter, pageInfo);
  }

  /**
   * Count
   * @param query
   * @returns number
   */
  async count(query = {}, options: QueryOptions = {}): Promise<number> {
    return this.model.countDocuments(query, options).lean();
  }
}
