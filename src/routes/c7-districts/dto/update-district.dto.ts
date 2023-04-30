import { CreateDistrictDto } from './create-district.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateDistrictDto extends PartialType(CreateDistrictDto) {}
