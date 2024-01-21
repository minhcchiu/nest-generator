import { join } from "path";
import { ConfigName, MailerConfig } from "~config/environment";

import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { MailService } from "./mail.service";

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: async (config: ConfigService) => {
				const { transport, defaults } = config.get<MailerConfig>(
					ConfigName.mailer,
				);

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

			inject: [ConfigService],
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
