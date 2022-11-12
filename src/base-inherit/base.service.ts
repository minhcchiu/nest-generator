import { BaseInterface } from './base.interface';
import { NotFoundException } from '@nestjs/common';
import { ApiQueryParamsDto } from '~middleware/dto';
import {
  PaginateDocument,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
  QueryOptions,
  Types,
} from 'mongoose';

export class BaseService<T> implements BaseInterface<T> {
  private model: PaginateModel<T>;

  constructor(model: PaginateModel<T>) {
    this.model = model;
  }

  // ========== CREATE =================
  /**
   * Create new
   *
   * @param data
   * @returns
   */
  async create(data: any): Promise<any> {
    return this.model.create(data);
  }

  // ========== READ =================
  /**
   * Find all
   *
   * @param queryParams
   * @returns
   */
  async find(queryParams: ApiQueryParamsDto): Promise<any[] | []> {
    const { filter, population, projection, ...options } = queryParams;

    return this.model
      .find(filter, projection, options)
      .populate(population || '')
      .lean();
  }

  /**
   * Find and paginate
   *
   * @param queryParams
   * @returns
   */
  async paginate(
    queryParams: ApiQueryParamsDto,
  ): Promise<PaginateResult<PaginateDocument<T, any, PaginateOptions>>> {
    const pageInfo = {
      lean: true,
      page: queryParams.skip || 1,
      limit: queryParams.limit || 20,
      sort: queryParams.sort || '-updatedAt',
      populate: queryParams.population || [],
      projection: queryParams.projection || {},
    };

    return this.model.paginate(queryParams.filter, pageInfo);
  }

  /**
   * Find by ID
   *
   * @param id
   * @param options
   * @returns
   */
  async findById(id: Types.ObjectId, options: QueryOptions = {}): Promise<any | null> {
    const { population, projection, ...rest } = options;

    return this.model
      .findById(id, projection, rest)
      .populate(population || [])
      .lean();
  }

  /**
   * Find one
   *
   * @param filter
   * @param options
   * @returns
   */
  async findOne(filter: any = {}, options: QueryOptions = {}): Promise<any | null> {
    const { population, projection, ...rest } = options;

    return this.model
      .findOne(filter, projection, rest)
      .populate(population || [])
      .lean();
  }

  /**
   * Count
   *
   * @param query
   * @returns number
   */
  async count(query = {}, options: QueryOptions = {}): Promise<{ totalData: number }> {
    const totalData = await this.model.countDocuments(query, options).lean();

    return { totalData };
  }

  /**
   * Distinct
   *
   * @param field
   * @returns
   */
  async distinct(field: string) {
    return this.model.distinct(field);
  }

  // ========== UPDATE =================
  /**
   * Find by ID and update
   *
   * @param id
   * @param data
   * @param options
   * @returns
   */
  async updateById(
    id: Types.ObjectId,
    data: any,
    options: QueryOptions = { new: true },
  ): Promise<any | null> {
    const updated = await this.model.findByIdAndUpdate(id, data, options).lean();

    if (!updated) throw new NotFoundException('Item not found.');

    return updated;
  }

  /**
   * Find one and update
   *
   * @param query
   * @param data
   * @param options
   * @returns
   */
  async updateOne(
    query: object,
    data: any,
    options: QueryOptions = { new: true },
  ): Promise<any | null> {
    const updated = await this.model.findOneAndUpdate(query, data, options).lean();

    if (!updated) throw new NotFoundException('Item not found.');

    return updated;
  }

  /**
   * Update many
   *
   * @param query
   * @param data
   * @param options
   * @returns
   */
  async updateMany(query: object = {}, data: any, options: QueryOptions = {}): Promise<any> {
    return this.model.updateMany(query, data, options).lean();
  }

  // ========== DELETE =================
  /**
   * Find by id and delete
   *
   * @param id
   * @param options
   * @returns
   */
  async deleteById(id: Types.ObjectId, options: QueryOptions = {}): Promise<any> {
    const deleted = await this.model.findByIdAndDelete(id, options).lean();

    if (!deleted) throw new NotFoundException('Item not found.');

    return deleted;
  }

  /**
   * Find one and delete
   *
   * @param query
   * @param options
   * @returns
   */
  async deleteOne(query: object, options: QueryOptions = {}): Promise<any | null> {
    const deleted = await this.model.deleteOne(query, options).lean();

    if (!deleted) throw new NotFoundException('Item not found.');

    return deleted;
  }

  /**
   * Delete many
   *
   * @param query
   * @param options
   * @returns
   */
  async deleteMany(query: object = {}, options: QueryOptions = {}): Promise<any | null> {
    return this.model.deleteMany(query || {}, options).lean();
  }
}
