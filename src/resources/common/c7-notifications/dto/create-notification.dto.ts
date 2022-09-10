import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly idProvince: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly type: string;
}
