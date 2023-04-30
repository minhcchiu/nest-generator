import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'src/routes/users/enums/role.enum';

import { MenuLevel } from '../enum/menu-level';

export class CreateMenuDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly url: string;

  @IsOptional()
  @IsString()
  readonly icon: string;

  @IsNotEmpty()
  @IsEnum(MenuLevel)
  readonly level: MenuLevel;

  @IsNotEmpty()
  @IsNumber()
  readonly position: number;

  @IsOptional()
  @IsString()
  readonly link: string;

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
