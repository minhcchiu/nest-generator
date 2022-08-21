import { PartialType } from '@nestjs/mapped-types';
import { CreateProvinceDto } from './create-province.dto';

export default class UpdateProvinceDto extends PartialType(CreateProvinceDto) {}
