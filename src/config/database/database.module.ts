import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoosePaginateV2 } from './mongoose-paginate.config';
import { DatabaseConfig } from '~config/environment';

export const DatabaseModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],

  useFactory: async (config: ConfigService) => ({
    uri: config.get<DatabaseConfig>('database').uri,
    retryWrites: true,
    useNewUrlParser: true,
    autoIndex: true,

    connectionFactory: (connection: any) => {
      // Plugin
      connection.plugin(mongoosePaginateV2);

      // Check connect success
      if (connection.readyState === 1) {
        Logger.log(`MongDB Connected: ${connection.host}`, 'MongoDBConnection');
      }

      return connection;
    },

    w: 'majority',
  }),

  inject: [ConfigService],
});
