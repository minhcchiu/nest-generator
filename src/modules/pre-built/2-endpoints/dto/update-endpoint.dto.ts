import { PartialType } from "@nestjs/swagger";

import { CreateEndpointDto } from "./create-endpoint.dto";

export class UpdateEndpointDto extends PartialType(CreateEndpointDto) {}
