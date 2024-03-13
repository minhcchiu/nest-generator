import {
	CountOptions,
	DeleteOptions,
	DeleteResult,
	UpdateOptions,
} from "mongodb";
import {
	FilterQuery,
	MongooseQueryOptions,
	PaginateModel,
	QueryOptions,
	Types,
	UpdateQuery,
	UpdateWithAggregationPipeline,
} from "mongoose";

import { PaginateOptions } from "./base.interface";

export class BaseService<T> {
	private model: PaginateModel<T>;
	constructor(model: PaginateModel<T>) {
		this.model = model;
	}

	async create(input: Record<string, any>) {
		const result = await this.model.create(input);

		return result;
	}

	async createMany(inputs: Record<string, any>[]) {
		const result = await this.model.create(inputs);

		return result;
	}

	async findMany(
		filter: FilterQuery<T>,
		options: QueryOptions<T> = {
			page: 1,
			limit: 400,
		},
	) {
		const { page, limit, ...option } = options;
		const skip = (page - 1) * limit;

		Object.assign(option, { skip: option.skip || skip });

		const result = await this.model
			.find(filter, options?.projection, options)
			.lean();

		return result;
	}

	async findById(id: Types.ObjectId, options?: QueryOptions<T>) {
		return this.model.findById(id, options?.projection, options).lean();
	}

	async findOne(filter?: FilterQuery<T>, options?: QueryOptions<T>) {
		const result = await this.model
			.findOne(filter, options?.projection, options)
			.lean();

		return result;
	}

	async count(
		filter: FilterQuery<T> = {},
		options?: CountOptions &
			Omit<MongooseQueryOptions<T>, "lean" | "timestamps">,
	) {
		const result = await this.model.countDocuments(filter, options);

		return result;
	}

	async distinct(field: string, filter?: FilterQuery<T>) {
		const result = await this.model.distinct(field, filter);

		return <any[]>result;
	}

	async updateById(
		id: Types.ObjectId,
		input: UpdateQuery<T>,
		options: QueryOptions<T> = { new: true },
	) {
		const updated = await this.model.findByIdAndUpdate(id, input, options);

		return updated;
	}

	async updateOne(
		filter: FilterQuery<T>,
		input: UpdateQuery<T>,
		options: QueryOptions<T> = { new: true },
	) {
		const updated = await this.model.findOneAndUpdate(filter, input, options);

		return updated;
	}

	async updateMany(
		filter: FilterQuery<T>,
		input: UpdateQuery<T> | UpdateWithAggregationPipeline,
		options?: (UpdateOptions & Omit<MongooseQueryOptions<T>, "lean">) | null,
	) {
		const updated = await this.model.updateMany(filter, input, options);

		return updated;
	}

	async deleteById(id: Types.ObjectId, options?: QueryOptions<T>) {
		const updated = await this.model.findByIdAndDelete(id, options);

		return updated;
	}

	async deleteOne(filter: FilterQuery<T>, options?: QueryOptions<T>) {
		const deleted = await this.model.findOneAndDelete(filter, options);

		return deleted;
	}

	async deleteMany(
		filter: FilterQuery<T>,
		options?: DeleteOptions &
			Omit<MongooseQueryOptions<T>, "lean" | "timestamps">,
	): Promise<DeleteResult> {
		const deleted = await this.model.deleteMany(filter, options);

		return deleted;
	}

	async paginate(filter: FilterQuery<T>, pageOptions?: PaginateOptions) {
		const {
			projection,
			limit = 10,
			populate = [],
			page = 1,
			sort = "-updatedAt",
		} = pageOptions;

		const options = {
			page,
			limit,
			sort,
			populate,
			projection,
			lean: true,
		};

		const pagination = await this.model.paginate(filter, options);

		return pagination;
	}
}
