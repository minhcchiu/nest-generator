import { ObjectId } from 'mongodb';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '~pre-built/1-users/enums/role.enum';

import { ApiProperty } from '@nestjs/swagger';

export class CreateEndpointGroupDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly prefix: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  readonly endpoints: ObjectId[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    enum: Role,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsEnum(Role, { each: true })
  readonly roles: Role[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly position: number;
}
