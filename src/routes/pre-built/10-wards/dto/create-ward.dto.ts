import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateWardDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly idProvince: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly idDistrict: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly type: string;
}
