import { PartialType } from "@nestjs/swagger";

import { CreateWardDto } from "./create-ward.dto";

export class UpdateWardDto extends PartialType(CreateWardDto) {}
