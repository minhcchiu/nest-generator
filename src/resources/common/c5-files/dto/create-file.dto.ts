import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { StorageServiceEnum } from '../enum/storage-service.enum';

export class CreateFileDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly owner: string;

  @IsNotEmpty()
  @IsEnum(StorageServiceEnum)
  storage: StorageServiceEnum;

  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @IsNotEmpty()
  @IsString()
  readonly ext: string;

  @IsNotEmpty()
  @IsString()
  readonly files: string[];

  @IsNotEmpty()
  @IsString()
  readonly folder: string;

  @IsNotEmpty()
  @IsString()
  resourceID: string;

  @IsOptional()
  @IsString()
  secureUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly size: number;
}
