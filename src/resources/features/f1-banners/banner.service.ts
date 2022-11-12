import { Banner, BannerDocument } from './schemas/banner.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

@Injectable()
export class BannerService extends BaseService<BannerDocument> {
  constructor(@InjectModel(Banner.name) model: PaginateModel<BannerDocument>) {
    super(model);
  }
}
