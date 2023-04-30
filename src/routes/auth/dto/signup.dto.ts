import { IsNotEmpty, Length } from 'class-validator';
import { CreateUserDto } from '~routes/users/dto/create-user.dto';

export class SignupDto extends CreateUserDto {
  @IsNotEmpty()
  @Length(4)
  readonly otpCode?: string;
}
