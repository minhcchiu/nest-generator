import { PartialType } from '@nestjs/mapped-types';
import { CreateFileManagerDto } from './create-file-manager.dto';

export class UpdateFileManagerDto extends PartialType(CreateFileManagerDto) {}
