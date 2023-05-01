import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from '~routes/users/dto/create-user.dto';

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
