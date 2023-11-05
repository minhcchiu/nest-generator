import { ObjectId } from "mongodb";
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { stringIdToObjectId } from "./stringId_to_objectId";
import { Types } from "mongoose";

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
	public transform(value: string): Types.ObjectId {
		try {
			const objectId = ObjectId.createFromHexString(value);

			return stringIdToObjectId(objectId.toString());
		} catch (error) {
			throw new BadRequestException("Validation failed (string is expected)");
		}
	}
}
