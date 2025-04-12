import { PartialType } from "@nestjs/mapped-types";
import { CreateGeneratorDto } from "./create-generator.dto";

export class UpdateGeneratorDto extends PartialType(CreateGeneratorDto) {}
