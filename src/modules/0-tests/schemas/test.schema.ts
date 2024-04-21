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
}

export type TestDocument = Test & HydratedDocument<Test>;
export const TestSchema = SchemaFactory.createForClass(Test);
