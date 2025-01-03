import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateQuestionDto {
  @IsOptional()
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
  views: number = 0;

  @IsOptional()
  @IsNumber()
  upvoteCount: number = 0;

  @IsOptional()
  @IsNumber()
  downvoteCount: number = 0;

  @IsOptional()
  @IsNumber()
  answerCount: number = 0;

  @IsOptional()
  @IsObjectId({ each: true })
  tagIds: ObjectId[];

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  @Transform(({ value }) => value.map((tag: string) => tag.toLowerCase()))
  tags: string[];
}
