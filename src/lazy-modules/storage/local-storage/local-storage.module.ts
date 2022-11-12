import { LocalStorageService } from './local-storage.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [LocalStorageService],
  exports: [LocalStorageService],
})
export class LocalStorageModule {}
