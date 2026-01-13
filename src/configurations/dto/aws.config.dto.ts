import { IsNotEmpty, IsString, ValidateIf } from "class-validator";
import { StorageLocationEnum } from "~modules/pre-built/7-uploads/enum/store-location.enum";

export class AwsConfigDto {
  @IsNotEmpty()
  @IsString()
  STORAGE_SERVER: StorageLocationEnum;

  @ValidateIf(o => o.STORAGE_SERVER === StorageLocationEnum.S3)
  @IsString()
  S3_ACCESS_KEY: string;

  @ValidateIf(o => o.STORAGE_SERVER === StorageLocationEnum.S3)
  @IsString()
  S3_SECRET_ACCESS_KEY: string;

  @ValidateIf(o => o.STORAGE_SERVER === StorageLocationEnum.S3)
  @IsString()
  S3_REGION: string;

  @ValidateIf(o => o.STORAGE_SERVER === StorageLocationEnum.S3)
  @IsString()
  S3_ENDPOINT: string;

  @ValidateIf(o => o.STORAGE_SERVER === StorageLocationEnum.S3)
  @IsString()
  S3_BUCKET_NAME: string;

  @ValidateIf(o => o.STORAGE_SERVER === StorageLocationEnum.S3)
  @IsString()
  S3_CLOUD_FONT: string;

  @ValidateIf(o => o.STORAGE_SERVER === StorageLocationEnum.S3)
  @IsString()
  S3_CLOUD_FONT_KEY_PAIR_ID: string;

  @ValidateIf(o => o.STORAGE_SERVER === StorageLocationEnum.S3)
  @IsString()
  S3_CLOUD_FONT_PRIVATE_KEY: string;
}
