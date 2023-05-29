import { IsArray, IsNotEmpty, IsString } from 'class-validator';

import { ResourceTypeEnum } from '../enum/resource-type.enum';

export class SaveFilesDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  files: string[];

  @IsNotEmpty()
  @IsString()
  resourceType: ResourceTypeEnum;
}
