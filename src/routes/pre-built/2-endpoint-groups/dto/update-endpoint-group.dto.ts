import { PartialType } from '@nestjs/swagger';

import { CreateEndpointGroupDto } from './create-endpoint-group.dto';

export class UpdateEndpointGroupDto extends PartialType(CreateEndpointGroupDto) {}
