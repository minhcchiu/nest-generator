import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseWsExceptionFilter } from "@nestjs/websockets";

@Catch()
export class WsExceptionsFilter extends BaseWsExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const client = host.switchToWs().getClient();

		if (exception.response?.statusCode === 401) {
			client.emit("on-error", {
				message: exception.response.message,
				statusCode: exception.response.statusCode,
			});
			return;
		}

		super.catch(exception, host);
	}
}
