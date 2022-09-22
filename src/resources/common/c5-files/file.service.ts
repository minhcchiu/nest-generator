import { Injectable } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BaseService } from '~base-inherit/base.service';
import { File, FileDocument } from './schemas/file.schema';

@Injectable()
export class FileService extends BaseService<FileDocument> {
  constructor(@InjectModel(File.name) model: PaginateModel<FileDocument>) {
    super(model);
  }
}
