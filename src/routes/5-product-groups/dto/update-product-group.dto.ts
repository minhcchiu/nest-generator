import { PartialType } from "@nestjs/mapped-types";

import { CreateProductGroupDto } from "./create-product-group.dto";

export class UpdateProductGroupDto extends PartialType(CreateProductGroupDto) {}
