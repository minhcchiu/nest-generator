import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/routes/users/enums/role.enum';

import { ApiProperty } from '@nestjs/swagger';

import { HttpMethod } from '../enum/http-method';

export class CreateEndpointDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly path: string;

  @ApiProperty({ required: false })
  @IsEnum(HttpMethod)
  readonly method: HttpMethod;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly position: number;

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
  readonly userRoles: Role[];
}
