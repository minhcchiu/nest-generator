import { IsNotEmpty, IsString } from 'class-validator';
import { UploadTypeEnum } from '../enum/upload-type.enum';

export class SaveFileDto {
  @IsNotEmpty()
  @IsString()
  file: string;

  @IsNotEmpty()
  @IsString()
  uploadType: UploadTypeEnum;
}
