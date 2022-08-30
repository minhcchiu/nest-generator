import { Module } from '@nestjs/common';
import { LocalStorageHelper } from './local-storage.helper';
import { LocalStorageService } from './local-storage.service';

@Module({
  providers: [LocalStorageService, LocalStorageHelper],
  exports: [LocalStorageService],
})
export class LocalStorageModule {}
