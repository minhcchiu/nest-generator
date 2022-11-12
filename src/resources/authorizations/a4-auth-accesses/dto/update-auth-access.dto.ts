import { CreateAuthAccessDto } from './create-auth-access.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAuthAccessDto extends PartialType(CreateAuthAccessDto) {}
