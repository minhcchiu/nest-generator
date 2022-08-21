import { IsString } from 'class-validator';

export class CreateProvinceDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly type: string;
}
