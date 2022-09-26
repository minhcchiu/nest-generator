import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  readonly password: string;
}
