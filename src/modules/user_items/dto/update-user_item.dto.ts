import { PartialType } from "@nestjs/mapped-types";
import { CreateUserItemDto } from "~modules/user_items/dto/create-user_item.dto";

export class UpdateUserItemDto extends PartialType(CreateUserItemDto) {}
