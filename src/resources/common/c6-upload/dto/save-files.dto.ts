import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SaveFilesDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  files: string[];
}
