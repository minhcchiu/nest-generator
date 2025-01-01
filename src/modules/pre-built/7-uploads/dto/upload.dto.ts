import { IsEnum, IsOptional, IsString } from "class-validator";
import { ImageSize } from "~utils/image.util";

export class UploadDto {
  @IsOptional()
  @IsString({ each: true })
  @IsEnum(ImageSize, { each: true })
  imageSizes?: ImageSize[];
}
