import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";
import { stringIdToObjectId } from "./stringId_to_objectId";

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  public transform(value: string): Types.ObjectId {
    try {
      return stringIdToObjectId(value);
    } catch (error) {
      throw new BadRequestException("Validation failed (string is expected)");
    }
  }
}
