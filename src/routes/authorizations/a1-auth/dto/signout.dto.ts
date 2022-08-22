import { MinLength, MaxLength, IsString } from 'class-validator';

export class SignOutDto {
  @IsString()
  @MinLength(3)
  @MaxLength(512)
  readonly deviceID?: string;
}
