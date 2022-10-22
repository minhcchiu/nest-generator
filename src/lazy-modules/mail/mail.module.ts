import { join } from 'path';
import { MailerConfig } from '~config/environment';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const { transport, defaults, isGmailServer } =
          config.get<MailerConfig>('mailer');

        // Message log for test
        const msgLog = isGmailServer
          ? 'MailerModule GMAIL init'
          : 'MailerModule SENDGRID init';

        // Log
        Logger.log(`${msgLog}`, 'MailModule');

        // return options
        return {
          transport: isGmailServer ? transport.gmail : transport.sendgrid,
          defaults: defaults,

          template: {
            dir: join(__dirname, 'templates'),

            adapter: new HandlebarsAdapter(),

            options: { strict: true },
          },
        };
      },

      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
