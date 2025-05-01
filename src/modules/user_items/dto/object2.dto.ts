import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class Object2Dto {
  @IsOptional()
  @IsBoolean()
  isBoolean?: boolean;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountValue: number;
}
