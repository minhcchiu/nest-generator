import { CreateWardDto } from './create-ward.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWardDto extends PartialType(CreateWardDto) {}
