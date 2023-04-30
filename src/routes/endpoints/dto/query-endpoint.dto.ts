import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from 'src/routes/users/enums/role.enum';
import { HttpMethod } from '../enum/http-method';

export class QueryEndpointDto {
  @ApiProperty({ required: false })
  readonly name: string;

  @ApiProperty({ required: false })
  readonly url: string;

  @ApiProperty({ required: false })
  readonly method: HttpMethod;

  @ApiProperty({ required: false })
  readonly position: string;

  @ApiProperty({ required: false })
  readonly description?: string;

  @ApiProperty({
    enum: RoleEnum,
    isArray: true,
    required: false,
  })
  readonly userRoles: RoleEnum[];
}
