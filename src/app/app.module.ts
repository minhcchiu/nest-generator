import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { UserModule } from 'src/routes/users/user.module';
import QueryParamsMiddleware from 'src/utils/interceptor/query-params.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://minhchiu:Minhchiu.it.01@cluster0.llaipgz.mongodb.net',
      {
        dbName: 'awesome-nest-generator',
        retryWrites: true,
        connectionFactory: (connection) => {
          connection.plugin(mongoosePaginate);
          return connection;
        },
      },
    ),

    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(QueryParamsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
