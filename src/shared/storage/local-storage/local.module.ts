import { Global, Module } from "@nestjs/common";

import { LocalService } from "./local.service";

@Global()
@Module({
	providers: [LocalService],
	exports: [LocalService],
})
export class LocalModule {}
