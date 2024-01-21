import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { Post, PostSchema } from "./schemas/post.schema";

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Post.name,
				useFactory: () => {
					const schema = PostSchema;

					// eslint-disable-next-line
          schema.plugin(require('mongoose-slug-updater'));

					return schema;
				},
			},
		]),
	],
	controllers: [PostController],
	providers: [PostService],
	exports: [PostService],
})
export class PostModule {}
