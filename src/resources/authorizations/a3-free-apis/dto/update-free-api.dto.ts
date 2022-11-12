import { CreateFreeApiDto } from './create-free-api.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateFreeApiDto extends PartialType(CreateFreeApiDto) {}
