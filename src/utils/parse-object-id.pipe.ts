import { Types } from "mongoose";

import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

import { stringIdToObjectId } from "./stringId_to_objectId";

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
	public transform(value: string): Types.ObjectId {
		try {
			const objectId = new Types.ObjectId(value);

			return stringIdToObjectId(objectId.toString());
		} catch (error) {
			throw new BadRequestException("Validation failed (string is expected)");
		}
	}
}
