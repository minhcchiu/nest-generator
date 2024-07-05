import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { User } from "~modules/pre-built/1-users/schemas/user.schema";
import { ProjectDto } from "../dto/project.dto";
import { AppTypeEnum } from "../enums/app-type.enum";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "tests",
})
export class Test {
	@Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
	userId: Types.ObjectId;

	@Prop({ type: String, required: true })
	imageUrl: string;

	@Prop({ type: String, required: true })
	title: string;

	@Prop({ type: String, unique: true })
	link: string;

	@Prop({ type: [Date] })
	dates: Date[];

	@Prop({
		type: [
			{
				type: {
					userId: {
						type: SchemaTypes.ObjectId,
						ref: User.name,
						required: true,
					},
					title: { type: String, required: true },
					desc: String,
					tags: [String],
				},
			},
		],
	})
	projects?: ProjectDto[];

	@Prop({
		type: {
			userId: {
				type: SchemaTypes.ObjectId,
				ref: User.name,
				required: true,
			},
			title: { type: String, required: true },
			desc: String,
			tags: [String],
		},
	})
	project?: ProjectDto;

	@Prop({ type: Number, unique: true, required: true })
	position: number;

	@Prop({ type: String, enum: AppTypeEnum, required: true })
	appType: AppTypeEnum;
}

export type TestDocument = Test & HydratedDocument<Test>;
export const TestSchema = SchemaFactory.createForClass(Test);
