import { CreateUserDto } from '~common/c1-users/dto/create-user.dto';

import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
