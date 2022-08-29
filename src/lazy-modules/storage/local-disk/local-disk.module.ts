import { Module } from '@nestjs/common';
import { LocalDiskHelper } from './local-disk.helper';
import { LocalDiskService } from './local-disk.service';

@Module({
  providers: [LocalDiskService, LocalDiskHelper],
  exports: [LocalDiskService],
})
export class LocalDiskModule {}
