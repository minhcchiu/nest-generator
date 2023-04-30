import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthKeyType } from '~routes/auth/enums/auth-key.enum';

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  readonly authValue: string;

  @IsNotEmpty()
  @IsEnum(AuthKeyType)
  @IsString({ each: true })
  readonly authKey: string;
}
