import { Post } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { User } from "~modules/pre-built/1-users/schemas/user.schema";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "comments",
})
export class Comment {
	@Prop({ type: SchemaTypes.ObjectId, ref: Post.name, required: true })
	readonly postId: Types.ObjectId;

	@Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
	readonly authorId: Types.ObjectId;

	@Prop({ type: String, default: null })
	readonly text: string;

	@Prop({ type: String, default: null })
	readonly image: string;
}

export type CommentDocument = Comment & HydratedDocument<Comment>;
export const CommentSchema = SchemaFactory.createForClass(Comment);
