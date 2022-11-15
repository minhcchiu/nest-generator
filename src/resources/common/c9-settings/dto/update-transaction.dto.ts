import { CreateTransactionDto } from './create-transaction.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
