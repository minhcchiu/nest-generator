import { File, FileDocument } from './schemas/file.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

@Injectable()
export class FileService extends BaseService<FileDocument> {
  constructor(@InjectModel(File.name) model: PaginateModel<FileDocument>) {
    super(model);
  }
}
