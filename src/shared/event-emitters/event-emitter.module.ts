import { Global, Module } from "@nestjs/common";
import { EventEmitterModule as NestEventEmitterModule } from "@nestjs/event-emitter";
import { EventEmitterService } from "./event-emitter.service";

@Global()
@Module({
	imports: [NestEventEmitterModule.forRoot()],
	providers: [EventEmitterService],
	exports: [EventEmitterService],
})
export class EventEmitterModule {}
