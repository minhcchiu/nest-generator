import { IsArray, IsNumber, IsObject, Max, Min } from 'class-validator';

export class ApiQueryParamsDto {
  @IsObject()
  filter: object = {};

  @Min(1)
  @Max(30)
  @IsNumber()
  skip = 1;

  @Min(0)
  @Max(100)
  @IsNumber()
  limit = 20;

  @IsObject()
  sort: object = {};

  @IsObject()
  projection: any = {};

  @IsArray()
  population: any[] = [];
}
