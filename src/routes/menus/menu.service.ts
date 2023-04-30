import { Menu } from './menu.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

@Injectable()
export class MenuService extends BaseService<Menu> {
  constructor(@InjectModel(Menu.name) model: PaginateModel<Menu>) {
    super(model);
  }
}
