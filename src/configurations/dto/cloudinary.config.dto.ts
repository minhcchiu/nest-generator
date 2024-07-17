import { IsNotEmpty, IsString } from "class-validator";

export class CloudinaryConfigDto {
  @IsNotEmpty()
  @IsString()
  CLOUD_NAME: string;

  @IsNotEmpty()
  @IsString()
  CLOUD_API_KEY: string;

  @IsNotEmpty()
  @IsString()
  CLOUD_API_SECRET: string;

  @IsNotEmpty()
  @IsString()
  SERVER_NAME: string;
}
