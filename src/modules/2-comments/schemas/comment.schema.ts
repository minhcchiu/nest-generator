import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { AuthorDto } from "../dto/author.dto";
@Schema({
	timestamps: true,
	versionKey: false,
	collection: "comments",
})
export class Comment {
	@Prop({ type: SchemaTypes.ObjectId, ref: "Post", required: true })
	readonly postId: Types.ObjectId;

	@Prop({
		type: {
			_id: { type: SchemaTypes.ObjectId, ref: "User", required: true },
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
