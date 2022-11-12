import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApiResourceDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly userFrom: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly userTo: string;

  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @IsNotEmpty()
  @IsString()
  readonly entityId: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly thumbnail?: string;
}
