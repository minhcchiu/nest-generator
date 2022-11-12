import { FreeApi, FreeApiDocument } from './schemas/free-api.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

@Injectable()
export class FreeApiService extends BaseService<FreeApiDocument> {
  constructor(@InjectModel(FreeApi.name) model: PaginateModel<FreeApiDocument>) {
    super(model);
  }
}
