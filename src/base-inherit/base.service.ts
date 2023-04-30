import {
  FilterQuery,
  Model,
  QueryOptions,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { PageInfo, PaginateOptions } from './base.interface';

export class BaseService<T> {
  constructor(private model: Model<T>) {}

  create(data: any) {
    return this.model.create(data);
  }

  find(filter: FilterQuery<T>, options?: QueryOptions<T>) {
    return this.model.find(filter, options.projection, options).lean();
  }

  findById(id: Types.ObjectId, options?: QueryOptions<T>) {
    return this.model.findById(id, options.projection, options).lean();
  }

  findOne(filter?: FilterQuery<T>, options?: QueryOptions<T>) {
    return this.model.findOne(filter, options.projection, options).lean();
  }

  count(filter: FilterQuery<T> = {}, options: QueryOptions = {}) {
    return this.model.countDocuments(filter, options).lean();
  }

  distinct(field: string, filter?: FilterQuery<T>) {
    return this.model.distinct(field, filter).lean();
  }

  updateById(id: Types.ObjectId, data: UpdateQuery<T>, options: QueryOptions<T> = { new: true }) {
    return this.model.findByIdAndUpdate(id, data, options);
  }

  updateOne(
    filter: FilterQuery<T>,
    data: UpdateQuery<T>,
    options: QueryOptions<T> = { new: true },
  ) {
    return this.model.findOneAndUpdate(filter, data, options);
  }

  updateMany(
    filter: FilterQuery<T>,
    data: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: QueryOptions<T>,
  ) {
    return this.model.updateMany(filter, data, options);
  }

  deleteById(id: Types.ObjectId, options?: QueryOptions<T>) {
    return this.model.findByIdAndDelete(id, options);
  }

  deleteOne(filter: FilterQuery<T>, options?: QueryOptions<T>) {
    return this.model.deleteOne(filter, options);
  }

  deleteMany(filter: FilterQuery<T>, options?: QueryOptions<T>) {
    return this.model.deleteMany(filter, options);
  }

  async paginate(filter: FilterQuery<T>, pageOptions?: PaginateOptions) {
    const { projection, limit = 10, populate = [], page = 1, sort = '-updatedAt' } = pageOptions;

    const options = {
      skip: (page - 1) * limit || 0,
      limit,
      sort,
      populate,
      lean: true,
    };

    // count documents
    const countPromise = this.count(filter);
    // find documents
    const resultsPromise = this.model.find(filter, projection, options).lean();

    const [count, data] = await Promise.all([countPromise, resultsPromise]);

    // paginate info
    const totalPages = limit > 0 ? Math.ceil(count / limit) || 1 : null;
    const pageInfo: PageInfo = {
      totalData: count,
      limit,
      totalPages,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    };

    return { data, pageInfo };
  }
}
