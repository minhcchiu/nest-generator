import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { UploadTypeEnum } from '../enum/upload-type.enum';

export class SaveFilesDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  files: string[];

  @IsNotEmpty()
  @IsString()
  uploadType: UploadTypeEnum;
}
