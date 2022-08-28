import { Injectable } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BaseService } from 'src/base-inherit/base.service';
import {
  FileManager,
  FileManagerDocument,
} from './schemas/file-manager.schema';

@Injectable()
export class FileManagerService extends BaseService<FileManagerDocument> {
  constructor(
    @InjectModel(FileManager.name) model: PaginateModel<FileManagerDocument>,
  ) {
    super(model);
  }
}
