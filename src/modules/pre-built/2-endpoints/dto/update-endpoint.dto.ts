import { PartialType } from "@nestjs/mapped-types";
import { CreateEndpointDto } from "./create-endpoint.dto";
export class UpdateEndpointDto extends PartialType(CreateEndpointDto) {}
