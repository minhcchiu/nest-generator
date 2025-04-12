import { PartialType } from "@nestjs/mapped-types";
import { CreateSettingDto } from "~modules/pre-built/11-settings/dto/create-setting.dto";

export class UpdateSettingDto extends PartialType(CreateSettingDto) {}
