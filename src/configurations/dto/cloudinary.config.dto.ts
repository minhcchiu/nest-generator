import { IsNotEmpty, IsString, ValidateIf } from "class-validator";
import { StorageLocationEnum } from "~modules/pre-built/7-uploads/enum/store-location.enum";

export class CloudinaryConfigDto {
  @IsNotEmpty()
  @IsString()
  STORAGE_SERVER: StorageLocationEnum;

  @ValidateIf(o => o.STORAGE_SERVER === StorageLocationEnum.Cloudinary)
  @IsString()
  CLOUD_NAME: string;

  @ValidateIf(o => o.STORAGE_SERVER === StorageLocationEnum.Cloudinary)
  @IsString()
  CLOUD_API_KEY: string;

  @ValidateIf(o => o.STORAGE_SERVER === StorageLocationEnum.Cloudinary)
  @IsString()
  CLOUD_API_SECRET: string;

  @ValidateIf(o => o.STORAGE_SERVER === StorageLocationEnum.Cloudinary)
  @IsString()
  SERVER_NAME: string;
}
