import { ObjectId } from "mongodb";

export const stringIdToObjectId = (id: string | ObjectId) => {
  return new ObjectId(id);
};

export const stringIdsToObjectId = (ids: (string | ObjectId)[]) => {
  return ids.map(id => new ObjectId(id));
};

export const objectIdToString = (id: string | ObjectId) => {
  return id.toString();
};

export const objectIdsToString = (ids: ObjectId[]) => {
  return ids.map(id => id.toString());
};

export const isObjectIdInList = (id: string | ObjectId, ids: (string | ObjectId)[]) => {
  return ids.some(item => item.toString() === id.toString());
};

export const isObjectId = (id: string | ObjectId) => {
  return typeof id === "string" && ObjectId.isValid(id);
};
