import { PaginateModel } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionService extends BaseService<TransactionDocument> {
  constructor(@InjectModel(Transaction.name) model: PaginateModel<TransactionDocument>) {
    super(model);
  }
}
