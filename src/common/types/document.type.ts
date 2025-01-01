import { ObjectId } from "mongodb";
export type DocumentType<T> = T & { _id: ObjectId };
