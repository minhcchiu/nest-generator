import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly userFrom: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly userTo: string;

  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly entityId: string;
}
