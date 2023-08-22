import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Comment, CommentSchema } from "./schemas/comment.schema";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Comment.name,
				useFactory: () => {
					const schema = CommentSchema;

					// eslint-disable-next-line
          schema.plugin(require('mongoose-slug-updater'));

					return schema;
				},
			},
		]),
	],
	controllers: [CommentController],
	providers: [CommentService],
	exports: [CommentService],
})
export class CommentModule {}
