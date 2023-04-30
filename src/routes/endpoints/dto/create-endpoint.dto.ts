import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from 'src/routes/users/enums/role.enum';
import { HttpMethod } from '../enum/http-method';

export class CreateEndpointDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly url: string;

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
    enum: RoleEnum,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsEnum(RoleEnum, { each: true })
  readonly userRoles: RoleEnum[];
}
