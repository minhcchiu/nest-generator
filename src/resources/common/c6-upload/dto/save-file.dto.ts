import { IsNotEmpty, IsString } from 'class-validator';

export class SaveFileDto {
  @IsNotEmpty()
  @IsString()
  file: string;
}
