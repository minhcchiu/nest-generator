import { IsNotEmpty, IsString } from "class-validator";

export class UploadConfigDto {
  @IsNotEmpty()
  @IsString()
  UPLOAD_AUTO_EXT: string;

  @IsNotEmpty()
  @IsString()
  UPLOAD_AUTO_MAX_SIZE: string;

  @IsNotEmpty()
  @IsString()
  UPLOAD_AUDIO_EXT: string;

  @IsNotEmpty()
  @IsString()
  UPLOAD_AUDIO_MAX_SIZE: string;

  @IsNotEmpty()
  @IsString()
  UPLOAD_VIDEO_EXT: string;

  @IsNotEmpty()
  @IsString()
  UPLOAD_VIDEO_MAX_SIZE: string;

  @IsNotEmpty()
  @IsString()
  UPLOAD_IMAGE_EXT: string;

  @IsNotEmpty()
  @IsString()
  UPLOAD_IMAGE_MAX_SIZE: string;

  @IsNotEmpty()
  @IsString()
  UPLOAD_RAW_EXT: string;

  @IsNotEmpty()
  @IsString()
  UPLOAD_RAW_MAX_SIZE: string;

  @IsNotEmpty()
  @IsString()
  UPLOAD_IMAGE_FOLDER: string;

  @IsNotEmpty()
  @IsString()
  UPLOAD_VIDEO_FOLDER: string;

  @IsNotEmpty()
  @IsString()
  UPLOAD_AUDIO_FOLDER: string;

  @IsNotEmpty()
  @IsString()
  UPLOAD_RAW_FOLDER: string;

  @IsNotEmpty()
  @IsString()
  UPLOAD_AUTO_FOLDER: string;
}
