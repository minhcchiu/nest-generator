import { join } from "path";

import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";

import { EnvStatic } from "src/configurations/static.env";
import { MailService } from "./mail.service";

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: async () => {
				const { transport, defaults } = EnvStatic.getMailerConfig();

				// return options
				const options = {
					transport: transport.gmail,
					defaults,
					template: {
						dir: join(__dirname, "templates"),
						adapter: new HandlebarsAdapter(),
						options: { strict: true },
					},
				};

				return options;
			},
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
