import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { User } from "~routes/pre-built/1-users/schemas/user.schema";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "posts",
})
export class Post {
	@Prop({ type: String, default: null })
	readonly text: string;

	@Prop({ type: String, default: null })
	readonly image: string;

	@Prop({ type: String, ref: User.name })
	readonly postedBy: User;

	@Prop({ type: [{ type: String, ref: User.name }], default: [] })
	readonly likes: string[];
}

export type PostDocument = Post & HydratedDocument<Post>;
export const PostSchema = SchemaFactory.createForClass(Post);
