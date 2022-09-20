import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordByTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  password: string;
}
