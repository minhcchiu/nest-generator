import { PartialType } from "@nestjs/swagger";

import { CreateProductGroupDto } from "./create-product-group.dto";

export class UpdateProductGroupDto extends PartialType(CreateProductGroupDto) {}
