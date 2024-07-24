import { PopulateOptions } from "mongoose";

export interface PaginateOptions {
  sort?: object | string | undefined;
  populate?: PopulateOptions[] | string[] | PopulateOptions | string;
  projection?: string | Record<string, number>;
  lean?: boolean | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}
