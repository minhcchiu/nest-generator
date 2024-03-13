import { PartialType } from "@nestjs/swagger";

import { CreateUserFileDto } from "./create-user-file.dto";

export class UpdateUserFileDto extends PartialType(CreateUserFileDto) {}
