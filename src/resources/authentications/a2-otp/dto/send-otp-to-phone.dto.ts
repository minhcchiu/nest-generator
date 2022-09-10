import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class SendOtpToPhoneDto {
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone: string;

  @IsOptional()
  @IsString()
  zipCode = '+84';

  @IsOptional()
  @IsString()
  country = 'VN';
}
