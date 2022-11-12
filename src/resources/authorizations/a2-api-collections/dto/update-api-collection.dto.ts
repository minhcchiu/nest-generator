import { CreateApiCollectionDto } from './create-api-collection.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateApiCollectionDto extends PartialType(CreateApiCollectionDto) {}
