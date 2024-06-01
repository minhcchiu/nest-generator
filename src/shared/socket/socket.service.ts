import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { TokenService } from "~modules/pre-built/5-tokens/token.service";

@Injectable()
export class SocketService {
	constructor(private readonly tokenService: TokenService) {}

	async getUserFromSocket(socket: Socket) {
		const { authorization } = socket.handshake.headers;

		const textBearer = "Bearer ";

		if (!authorization || !authorization.startsWith(textBearer))
			throw new WsException("Requires login!");

		const token = authorization.slice(textBearer.length);

		const user = await this.tokenService.verifyAccessToken(token);

		if (!user) throw new WsException("Invalid credentials.");

		return user;
	}
}
