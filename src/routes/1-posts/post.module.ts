import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Post, PostSchema } from "./schemas/post.schema";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";

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
