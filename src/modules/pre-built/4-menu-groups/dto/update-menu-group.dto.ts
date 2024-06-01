import { PartialType } from "@nestjs/mapped-types";
import { CreateMenuGroupDto } from "./create-menu-group.dto";

export class UpdateMenuGroupDto extends PartialType(CreateMenuGroupDto) {}
