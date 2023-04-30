import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateWardDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly idProvince: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  readonly idDistrict: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly type: string;
}
