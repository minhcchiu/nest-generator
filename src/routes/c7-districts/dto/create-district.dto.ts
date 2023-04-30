import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CreateDistrictDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly idProvince: ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly type: string;
}
