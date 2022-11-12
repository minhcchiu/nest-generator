import { ApiCollection, ApiCollectionDocument } from './schemas/api-collection.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

@Injectable()
export class ApiCollectionService extends BaseService<ApiCollectionDocument> {
  constructor(@InjectModel(ApiCollection.name) model: PaginateModel<ApiCollectionDocument>) {
    super(model);
  }
}
