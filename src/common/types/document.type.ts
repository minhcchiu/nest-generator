import { Types } from "mongoose";

export type DocumentType<T> = T & { _id: Types.ObjectId };
