import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { DatabaseConfig } from "./config/database-config.type";
import { databaseConfigName } from "./config/database.config";
import { mongoosePaginateV2 } from "./mongoose-paginate.config";

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],

			useFactory: async (config: ConfigService) => ({
				uri: config.get<DatabaseConfig>(databaseConfigName).uri,
				retryWrites: true,
				autoIndex: true,

				connectionFactory: (connection: any) => {
					// Plugin
					connection.plugin(mongoosePaginateV2);

					// Check connect success
					if (connection.readyState === 1) {
						Logger.log(
							`MongDB Connected: ${connection.host}`,
							"MongoDBConnection",
						);
					}

					return connection;
				},

				w: "majority",
			}),

			inject: [ConfigService],
		}),
	],
})
export class DatabaseModule {}
