import { PartialType } from "@nestjs/mapped-types";
import { CreateTagFollowerDto } from "./create-tag_follower.dto";

export class UpdateTagFollowerDto extends PartialType(CreateTagFollowerDto) {}
