import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateCartProductQuantityDto {
  @IsNotEmpty()
  @IsNumber()
  readonly oldQuantity: number;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;
}
