import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  position: number;

  @IsNotEmpty()
  @IsString()
  countStores: string;

  @IsBoolean()
  isOther: boolean;

  @IsBoolean()
  isActive: boolean;
}
