import { CreateProvinceDto } from './create-province.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProvinceDto extends PartialType(CreateProvinceDto) {}
