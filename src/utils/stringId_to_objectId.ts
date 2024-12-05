import { ObjectId } from "mongodb";

export const stringIdToObjectId = (id: string) => {
  return new ObjectId(id);
};

export const stringIdsToObjectId = (ids: string[]) => {
  return ids.map(id => new ObjectId(id));
};

export const objectIdToString = (id: ObjectId) => {
  return id.toString();
};

export const objectIdsToString = (ids: ObjectId[]) => {
  return ids.map(id => id.toString());
};
