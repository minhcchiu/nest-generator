import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoosePaginateV2 from 'mongoose-paginate-v2';
import { DatabaseConfig } from '~config/enviroment';

/**
 * Database module
 */
export const DatabaseModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],

  useFactory: async (config: ConfigService) => ({
    uri: config.get<DatabaseConfig>('database').uri,
    retryWrites: true,

    connectionFactory: (connection: any) => {
      connection.plugin(mongoosePaginateV2);

      return connection;
    },

    w: 'majority',
  }),

  inject: [ConfigService],
});
