import { CreateRightsGroupDto } from './create-rights-group.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRightsGroupDto extends PartialType(CreateRightsGroupDto) {}
