import { CreateUserDto } from '~routes/users/dto/create-user.dto';

import { PartialType, PickType } from '@nestjs/swagger';

export class RegisterDto extends PartialType(
  PickType(CreateUserDto, [
    'phone',
    'email',
    'socialToken',
    'accountType',
    'password',
    'dateOfBirth',
    'fullName',
    'gender',
    'avatar',
  ] as const),
) {}
