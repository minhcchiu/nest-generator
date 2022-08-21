import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class SendOtpByPhoneDto {
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
