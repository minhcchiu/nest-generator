import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateTagFollowerDto {
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
  uptag_followerCount?: number;

  @IsOptional()
  @IsNumber()
  downtag_followerCount?: number;
}
