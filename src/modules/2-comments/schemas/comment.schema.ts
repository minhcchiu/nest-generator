import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { AuthorDto } from "../dto/author.dto";
@Schema({
	timestamps: true,
	versionKey: false,
	collection: "comments",
})
export class Comment {
	@Prop({ type: String, ref: "Post", required: true })
	readonly postId: string;

	@Prop({
		type: {
			_id: { type: String, ref: "User", required: true },
			avatar: { type: String, default: null },
			fullName: { type: String, default: null },
		},
	})
	readonly author: AuthorDto;
	@Prop({ type: String, default: null })
	readonly text: string;

	@Prop({ type: String, default: null })
	readonly image: string;
}

export type CommentDocument = Comment & HydratedDocument<Comment>;
export const CommentSchema = SchemaFactory.createForClass(Comment);
