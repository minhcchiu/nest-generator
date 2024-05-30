import { Types } from "mongoose";
export const stringIdToObjectId = (id: string) => {
	return new Types.ObjectId(id);
};
