import { IsNumber, IsOptional } from "class-validator";

import { PartialType } from "@nestjs/mapped-types";

import { CreateCartDto } from "./create-cart.dto";

export class UpdateCartDto extends PartialType(CreateCartDto) {
	@IsOptional()
	@IsNumber()
	oldQuantity: number;

	@IsOptional()
	@IsNumber()
	oldPrice: number;
}
