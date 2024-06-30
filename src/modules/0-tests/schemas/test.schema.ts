import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "testses",
})
export class Test {
	@Prop({ type: Types.ObjectId, ref: "User", required: true })
	userString: string;

	@Prop({ type: SchemaTypes.ObjectId, ref: "User" })
	userId: Types.ObjectId;

	@Prop({ type: Number, unique: true })
	position: number;

	@Prop({ type: Boolean, required: true })
	update: boolean;

	@Prop({ type: Date, default: Date.now })
	dateBirth: Date;
}

export type TestDocument = Test & HydratedDocument<Test>;
export const TestSchema = SchemaFactory.createForClass(Test);
