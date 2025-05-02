import { CountOptions, DeleteOptions, DeleteResult, ObjectId, UpdateOptions } from "mongodb";
import {
  AggregateOptions,
  AnyBulkWriteOperation,
  FilterQuery,
  Model,
  PipelineStage,
  QueryOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
} from "mongoose";
import { PaginationInfo } from "~common/database/mongoose-paginate.config";
import { PaginateOptions } from "./base.interface";

export class BaseService<T> {
  constructor(private readonly model: Model<T>) {}

  async create(input: Record<string, any>) {
    return this.model.create(input);
  }

  async createMany(inputs: Record<string, any>[]) {
    return this.model.create(inputs);
  }

  async aggregate(pipeline?: PipelineStage[], options?: AggregateOptions) {
    return this.model.aggregate(pipeline, options);
  }

  async findMany(filter: FilterQuery<T>, options: QueryOptions<T> = { lean: true }) {
    const { page, ...option } = options;
    const skip = (page - 1) * options?.limit;

    Object.assign(option, { skip: option.skip || skip });

    return this.model.find(filter, options?.projection, options);
  }

  async findById(id: ObjectId, options: QueryOptions<T> = { lean: true }) {
    return this.model.findById(id, options?.projection, options);
  }

  async findOne(filter?: FilterQuery<T>, options: QueryOptions<T> = { lean: true }) {
    return this.model.findOne(filter, options?.projection, options);
  }

  async count(filter: FilterQuery<T> = {}, options?: CountOptions | any) {
    return this.model.countDocuments(filter, options);
  }

  async distinct(field: string, filter?: FilterQuery<T>): Promise<any[]> {
    return this.model.distinct(field, filter);
  }

  async updateById(id: ObjectId, input: UpdateQuery<T>, options: QueryOptions<T> = { new: true }) {
    return this.model.findByIdAndUpdate(id, input, options);
  }

  async updateOne(
    filter: FilterQuery<T>,
    input: UpdateQuery<T>,
    options: QueryOptions<T> = { new: true },
  ) {
    return this.model.findOneAndUpdate(filter, input, options);
  }

  async updateMany(
    filter: FilterQuery<T>,
    input: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: UpdateOptions | any,
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateMany(filter, input, options);
  }

  async deleteById(id: ObjectId, options?: QueryOptions<T>) {
    return this.model.findByIdAndDelete(id, options);
  }

  async deleteOne(filter: FilterQuery<T>, options?: QueryOptions<T>) {
    return this.model.findOneAndDelete(filter, options);
  }

  async deleteMany(filter: FilterQuery<T>, options?: DeleteOptions | any): Promise<DeleteResult> {
    return this.model.deleteMany(filter, options);
  }

  async bulkWrite(writes: AnyBulkWriteOperation<any>[]) {
    return this.model.bulkWrite(writes);
  }

  async paginate(
    filter: FilterQuery<T>,
    pageOptions: PaginateOptions = {},
  ): Promise<{ data: T[]; paginationInfo: PaginationInfo }> {
    const { projection, limit = 10, populate = [], page = 1, sort = "-createdAt" } = pageOptions;

    const options = {
      page,
      limit,
      sort,
      populate,
      projection,
      lean: true,
    };

    return (this.model as any).paginate(filter, options);
  }
}
