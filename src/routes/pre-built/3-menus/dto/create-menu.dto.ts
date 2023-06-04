import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '~pre-built/1-users/enums/role.enum';
import { ObjectId } from 'mongodb';
import { MenuLevel } from '../enum/menu-level';

export class CreateMenuDto {
  @IsOptional()
  @IsMongoId()
  readonly parentId?: ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly icon?: string;

  @IsOptional()
  @IsEnum(MenuLevel)
  readonly level: MenuLevel;

  @IsOptional()
  @IsString()
  readonly url?: string;

  @IsOptional()
  @IsNumber()
  readonly position?: number;

  @IsOptional()
  @IsBoolean()
  readonly isHorizontal: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isShow: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  readonly role: Role[];
}
