import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'posts',
})
export class Post {
  @Prop({ type: String, default: null })
  readonly text: string;

  @Prop({ type: String, default: null })
  readonly image: string;

  @Prop({ type: String, ref: 'User' })
  readonly postedBy: string;

  @Prop({ type: [{ type: String, ref: 'User' }], default: [] })
  readonly likes: string[];
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
