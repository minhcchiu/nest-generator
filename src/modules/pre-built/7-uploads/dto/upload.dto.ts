import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ImageSize } from "~utils/image.util";

export class UploadDto {
	@IsNotEmpty()
	@IsString({ each: true })
	@IsEnum(ImageSize, { each: true })
	imageSizes: ImageSize[];
}
