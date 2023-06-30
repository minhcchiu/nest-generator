import { ObjectId } from 'mongodb';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, string> {
  public transform(value: string): string {
    try {
      const objectId = ObjectId.createFromHexString(value);

      return objectId.toString();
    } catch (error) {
      throw new BadRequestException('Validation failed (string is expected)');
    }
  }
}
