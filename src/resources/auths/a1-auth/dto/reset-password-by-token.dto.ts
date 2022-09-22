import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordByTokenDto {
  @IsNotEmpty()
  @IsString()
  readonly token: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  readonly password: string;
}
