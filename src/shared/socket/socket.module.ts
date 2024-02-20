import { TokenModule } from "~routes/pre-built/5-tokens/token.module";

import { Global, Module } from "@nestjs/common";

import { SocketGateway } from "./socket.gateway";
import { SocketService } from "./socket.service";

@Global()
@Module({
	imports: [TokenModule],
	providers: [SocketService, SocketGateway],
	exports: [SocketService, SocketGateway],
})
export class SocketModule {}
