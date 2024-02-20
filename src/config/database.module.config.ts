import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { mongoosePaginateV2 } from "./mongoose-paginate.config";
import {
	DatabaseConfig,
	databaseConfigName,
} from "./environment/database.config";

export const DatabaseModuleConfig = MongooseModule.forRootAsync({
	imports: [ConfigModule],

	useFactory: async (config: ConfigService) => ({
		uri: config.get<DatabaseConfig>(databaseConfigName).uri,
		retryWrites: true,
		useNewUrlParser: true,
		autoIndex: true,

		connectionFactory: (connection: any) => {
			// Plugin
			connection.plugin(mongoosePaginateV2);

			// Check connect success
			if (connection.readyState === 1) {
				Logger.log(`MongDB Connected: ${connection.host}`, "MongoDBConnection");
			}

			return connection;
		},

		w: "majority",
	}),

	inject: [ConfigService],
});
