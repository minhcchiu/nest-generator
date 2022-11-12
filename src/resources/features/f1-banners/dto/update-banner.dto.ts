import { CreateBannerDto } from './create-banner.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateBannerDto extends PartialType(CreateBannerDto) {}
