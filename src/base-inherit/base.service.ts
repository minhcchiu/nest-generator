import { CountOptions, DeleteOptions, DeleteResult, UpdateOptions } from "mongodb";
import {
  AggregateOptions,
  FilterQuery,
  Model,
  PipelineStage,
  QueryOptions,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
} from "mongoose";
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

  async findMany(filter: FilterQuery<T>, options: QueryOptions<T> = {}) {
    const { page, ...option } = options;
    const skip = (page - 1) * options?.limit;

    Object.assign(option, { skip: option.skip || skip });

    return this.model.find(filter, options?.projection, options).lean();
  }

  async findById(id: Types.ObjectId, options?: QueryOptions<T>) {
    return this.model.findById(id, options?.projection, options).lean();
  }

  async findOne(filter?: FilterQuery<T>, options?: QueryOptions<T>) {
    return this.model.findOne(filter, options?.projection, options).lean();
  }

  async count(filter: FilterQuery<T> = {}, options?: CountOptions | any) {
    return this.model.countDocuments(filter, options);
  }

  async distinct(field: string, filter?: FilterQuery<T>): Promise<any[]> {
    return this.model.distinct(field, filter);
  }

  async updateById(
    id: Types.ObjectId,
    input: UpdateQuery<T>,
    options: QueryOptions<T> = { new: true },
  ) {
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

  async deleteById(id: Types.ObjectId, options?: QueryOptions<T>) {
    return this.model.findByIdAndDelete(id, options);
  }

  async deleteOne(filter: FilterQuery<T>, options?: QueryOptions<T>) {
    return this.model.findOneAndDelete(filter, options);
  }

  async deleteMany(filter: FilterQuery<T>, options?: DeleteOptions | any): Promise<DeleteResult> {
    return this.model.deleteMany(filter, options);
  }

  async paginate(filter: FilterQuery<T>, pageOptions: PaginateOptions = {}) {
    const { projection, limit = 10, populate = [], page = 1, sort = "-updatedAt" } = pageOptions;

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
