import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from '~routes/users/dto/create-user.dto';

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
