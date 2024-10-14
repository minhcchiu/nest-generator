import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { stringIdToObjectId } from "./stringId_to_objectId";

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, ObjectId> {
  public transform(value: string): ObjectId {
    try {
      return stringIdToObjectId(value);
    } catch (error) {
      throw new BadRequestException("Validation failed (string is expected)");
    }
  }
}
