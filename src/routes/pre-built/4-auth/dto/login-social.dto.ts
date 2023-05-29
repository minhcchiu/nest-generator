import { CreateUserDto } from '~pre-built/1-users/dto/create-user.dto';

import { PartialType, PickType } from '@nestjs/swagger';

export class LoginSocialDto extends PartialType(
  PickType(CreateUserDto, [
    'socialToken',
    'accountType',
    'dateOfBirth',
    'fullName',
    'gender',
    'avatar',
  ] as const),
) {}
