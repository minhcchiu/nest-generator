import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthKeyEnum } from '~auths/a1-auth/enums/auth-key.enum';

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  readonly authValue: string;

  @IsNotEmpty()
  @IsEnum(AuthKeyEnum)
  @IsString({ each: true })
  readonly authKey: string;
}
