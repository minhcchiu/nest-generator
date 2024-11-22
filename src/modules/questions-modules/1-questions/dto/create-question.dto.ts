import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsObjectId()
  authorId: ObjectId;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  views?: number;

  @IsOptional()
  @IsNumber()
  upvoteCount?: number;

  @IsOptional()
  @IsNumber()
  downvoteCount?: number;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  @Transform(({ value }) => value.map((tag: string) => tag.toLowerCase()))
  tags: string[];
}
