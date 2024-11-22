import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  name: string;

  @IsOptional()
  @IsNumber()
  questionCount?: number;

  @IsOptional()
  @IsNumber()
  followerCount?: number;
}
