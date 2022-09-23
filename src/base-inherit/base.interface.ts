import {
  Types,
  PaginateResult,
  PaginateDocument,
  PaginateOptions,
  QueryOptions,
} from 'mongoose';

export interface BaseInterface<T> {
  /**
   * Find All
   *
   * @param query
   * @param paginateOpts
   */
  find(query: object, paginateOpts?: PaginateOptions): Promise<any[]>;

  /**
   * Find by id
   *
   * @param id
   */
  findById(id: Types.ObjectId): Promise<any>;

  /**
   * Find one
   *
   * @param query
   */
  findOne(query: object): Promise<any>;

  /**
   * Create
   *
   * @param payload
   */
  create(payload: any): Promise<any>;

  /**
   * Find by id and update
   *
   * @param id
   * @param payload
   * @param options
   */
  updateById(
    id: Types.ObjectId,
    payload: any,
    options?: QueryOptions<T>,
  ): Promise<any>;

  /**
   * Find one and update
   *
   * @param query
   * @param payload
   * @param options
   */
  updateOne(
    query: object,
    payload: any,
    options?: QueryOptions<T>,
  ): Promise<any>;

  /**
   * Update many
   *
   * @param query
   * @param payload
   * @param options
   */
  updateMany(
    query: object,
    payload: any,
    options?: QueryOptions<T>,
  ): Promise<any>;

  /**
   * Find by id and delete
   *
   * @param id
   * @param options
   */
  deleteById(id?: Types.ObjectId, options?: QueryOptions<T>): Promise<any>;

  /**
   * Find one and delete
   *
   * @param query
   * @param options
   */
  deleteOne(query?: object, options?: QueryOptions<T>): Promise<any>;

  /**
   * Delete many
   *
   * @param query
   * @param options
   */
  deleteMany(query?: object, options?: QueryOptions<T>): Promise<any>;

  /**
   * Paginate
   *
   * @param query
   * @param paginateOpts
   * @param args
   */
  paginate(
    query: object,
    paginateOpts?: PaginateOptions,
    ...args: any[]
  ): Promise<PaginateResult<PaginateDocument<T, any, PaginateOptions>>>;

  /**
   * Count
   *
   * @param query
   */
  count(query: object, options: QueryOptions): Promise<{ totalDocs: number }>;
}
