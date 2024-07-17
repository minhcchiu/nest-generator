import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { LocationDto } from "~dto/location.dto";

export class CreateShopDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsNotEmpty()
  @IsString()
  contactInfo: string;
}
