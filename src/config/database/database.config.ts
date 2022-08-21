import { MongooseModule } from '@nestjs/mongoose';
import * as mongoosePaginateV2 from 'mongoose-paginate-v2';

const URI = process.env.DATABASE_URI;
const dbName = process.env.DATABASE_NAME;

export const DatabaseConfig = MongooseModule.forRoot(URI, {
  dbName,
  w: 'majority',
  retryWrites: true,
  connectionFactory: (connection) => {
    connection.plugin(mongoosePaginateV2);
    return connection;
  },
});
