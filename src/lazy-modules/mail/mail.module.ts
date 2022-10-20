import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Global, Logger, Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailerConfig } from '~config/enviroment';

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
