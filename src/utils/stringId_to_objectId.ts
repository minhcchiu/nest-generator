import { ObjectId } from "mongodb";

export const stringIdToObjectId = (id: string) => {
  return new ObjectId(id);
};
