import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "tasks",
})
export class Task {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  status: {
    value: string;
    label: string;
    icon: string;
    amount: number;
  }[];

  @Prop({ type: SchemaTypes.Mixed, required: true })
  label: {
    value: string;
    label: string;
  }[];

  @Prop({ type: SchemaTypes.Mixed, required: true })
  priority: {
    value: string;
    label: string;
    icon: string;
    amount: number;
  }[];
}

export type TaskDocument = Task & HydratedDocument<Task>;
export const TaskSchema = SchemaFactory.createForClass(Task);
