import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfig } from '~config/enviroment';
import { mongoosePaginateV2 } from './mongoose-paginate.config';

export const DatabaseModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],

  useFactory: async (config: ConfigService) => ({
    uri: config.get<DatabaseConfig>('database').uri,
    retryWrites: true,
    useNewUrlParser: true,
    autoIndex: true,

    connectionFactory: (connection: any) => {
      connection.plugin(mongoosePaginateV2);

      return connection;
    },

    w: 'majority',
  }),

  inject: [ConfigService],
});
