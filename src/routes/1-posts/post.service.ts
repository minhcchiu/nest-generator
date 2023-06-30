import { PaginateModel } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostService extends BaseService<PostDocument> {
  constructor(@InjectModel(Post.name) model: PaginateModel<PostDocument>) {
    super(model);
  }
}
