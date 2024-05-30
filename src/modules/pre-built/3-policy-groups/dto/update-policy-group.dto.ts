import { PartialType } from "@nestjs/mapped-types";
import { CreatePolicyGroupDto } from "./create-policy-group.dto";

export class UpdatePolicyGroupDto extends PartialType(CreatePolicyGroupDto) {}
