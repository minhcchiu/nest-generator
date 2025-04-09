import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { FileDetailEnum } from "../enums/file-detail.enum";

export class FileDetailDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  @IsNumber()
  sortOrder: number;

  @IsString()
  @IsEnum(FileDetailEnum)
  fileType: FileDetailEnum;

  @IsOptional()
  @IsString()
  thumbnail: string;
}
