import { PartialType } from "@nestjs/mapped-types";
import { CreateSystemMenuDto } from "./create-system-menu.dto";

export class UpdateSystemMenuDto extends PartialType(CreateSystemMenuDto) {}
