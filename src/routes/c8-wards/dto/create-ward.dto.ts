import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CreateWardDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly idProvince: ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  readonly idDistrict: ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly type: string;
}
