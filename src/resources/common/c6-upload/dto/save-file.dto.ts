import { IsNotEmpty, IsString } from 'class-validator';
import { ResourceTypeEnum } from '../enum/resource-type.enum';

export class SaveFileDto {
  @IsNotEmpty()
  @IsString()
  file: string;

  @IsNotEmpty()
  @IsString()
  resourceType: ResourceTypeEnum;
}
