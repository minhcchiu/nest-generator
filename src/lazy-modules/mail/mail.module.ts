import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailerConfig } from '~interface/mailer.interface';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const mailerConfig = config.get<MailerConfig>('mailer');
        // const transport = mailerConfig.isGmailServer
        //   ? mailerConfig.transport.gmail
        //   : mailerConfig.transport.sendgrid;

        // console.log({ transport });

        return {
          transport: mailerConfig.transport.gmail,
          defaults: mailerConfig.defaults,

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
