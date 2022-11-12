import { CreateApiResourceDto } from './create-api-resource.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateApiResourceDto extends PartialType(CreateApiResourceDto) {}
