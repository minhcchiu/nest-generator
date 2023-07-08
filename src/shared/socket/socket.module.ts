import { Global, Module } from "@nestjs/common";
import { SocketService } from "./socket.service";
import { SocketGateway } from "./socket.gateway";
import { TokenModule } from "~routes/pre-built/5-tokens/token.module";

@Global()
@Module({
	imports: [TokenModule],
	providers: [SocketService, SocketGateway],
	exports: [SocketService, SocketGateway],
})
export class SocketModule {}
