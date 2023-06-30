import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  readonly text: string;

  @IsOptional()
  @IsString()
  readonly image: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  readonly likes: string[];
}
