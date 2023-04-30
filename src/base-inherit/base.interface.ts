import { LeanDocument, PopulateOptions } from 'mongoose';

export interface PaginateOptions {
  sort?: object | string | undefined;
  populate?: PopulateOptions[] | string[] | PopulateOptions | string;
  projection?: any;
  lean?: boolean | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export interface PageInfo {
  totalData: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface PaginateResponse<T> {
  data: LeanDocument<T>[];
  pageInfo: PageInfo;
}
