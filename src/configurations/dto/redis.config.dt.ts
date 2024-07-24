import { IsNotEmpty, IsString } from "class-validator";

export class RedisConfigDto {
  @IsNotEmpty()
  @IsString()
  REDIS_URL: string;
}
