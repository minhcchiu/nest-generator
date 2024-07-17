import { IsNotEmpty, IsString } from "class-validator";

export class ThrottlerConfigDto {
  @IsNotEmpty()
  @IsString()
  THROTTLER_TTL: string;

  @IsNotEmpty()
  @IsString()
  THROTTLER_LIMIT: string;
}
