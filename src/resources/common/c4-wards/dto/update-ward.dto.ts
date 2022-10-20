import { PartialType } from '@nestjs/mapped-types';

import { CreateWardDto } from './create-ward.dto';

export class UpdateWardDto extends PartialType(CreateWardDto) {}
