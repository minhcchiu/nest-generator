import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '~common/c1-user/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
